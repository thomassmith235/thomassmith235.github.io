(function () {
  const appUrl = 'https://fmea.nevis.tools';
  const analyticsId = 'G-NXQXLDE2XE';
  const consentKey = 'nevis_cookie_consent';
  const consentAccepted = 'accepted';
  const consentDeclined = 'declined';

  function buildUrl(base, path) {
    if (!path) return base;
    if (/^https?:\/\//i.test(path)) return path;
    const trimmedBase = base.replace(/\/+$/, '');
    const cleanedPath = path.startsWith('/') ? path : `/${path}`;
    return `${trimmedBase}${cleanedPath}`;
  }

  function setAppLinks(url) {
    document.querySelectorAll('a.open-app').forEach(a => {
      const extraPath = a.dataset.path || '';
      a.href = buildUrl(url, extraPath);
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  function enhanceUI() {
    const hint = document.querySelector('.hint');
    if (!hint) return;
    const firstAppLink = document.querySelector('.open-app');
    const linkPath = firstAppLink ? firstAppLink.dataset.path || '' : '';
    const resolvedLink = buildUrl(appUrl, linkPath);

    hint.textContent = 'App links point to: ' + resolvedLink;
  }

  function setupImageLightbox() {
    const images = document.querySelectorAll('img.tool-screenshot');
    if (!images.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = '<div class="lightbox-frame" role="dialog" aria-modal="true"><img class="lightbox-image" alt=""></div>';
    document.body.appendChild(overlay);

    const lightboxImage = overlay.querySelector('.lightbox-image');
    function closeLightbox() {
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });

    images.forEach((image) => {
      image.addEventListener('click', () => {
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || 'Screenshot';
        overlay.classList.add('open');
        document.body.classList.add('no-scroll');
      });
    });
  }

  function getStoredConsent() {
    try {
      return localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      localStorage.setItem(consentKey, value);
    } catch (error) {
      // Ignore storage failures and keep banner dismissed for this session.
    }
  }

  function loadAnalytics() {
    if (window.gtag) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.appendChild(script);
  }

  function dismissBanner(banner) {
    if (!banner) return;
    banner.classList.add('hide');
    setTimeout(() => {
      banner.remove();
    }, 200);
  }

  function createCookieBanner() {
    if (document.querySelector('.cookie-banner')) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML = `
      <div class="cookie-banner-inner">
        <div class="cookie-copy">
          <h2>Cookies</h2>
          <p>We use Google Analytics to understand how the site is used. Accept analytics cookies to help us improve.</p>
        </div>
        <div class="cookie-actions">
          <button class="cookie-button primary" type="button" data-cookie-action="accept">Accept analytics</button>
          <button class="cookie-button ghost" type="button" data-cookie-action="decline">No thanks</button>
          <a class="cookie-link" href="/privacy/">Privacy policy</a>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    const acceptButton = banner.querySelector('[data-cookie-action="accept"]');
    const declineButton = banner.querySelector('[data-cookie-action="decline"]');

    acceptButton.addEventListener('click', () => {
      storeConsent(consentAccepted);
      loadAnalytics();
      dismissBanner(banner);
    });

    declineButton.addEventListener('click', () => {
      storeConsent(consentDeclined);
      dismissBanner(banner);
    });
  }

  function initCookieConsent() {
    const storedConsent = getStoredConsent();
    if (storedConsent === consentAccepted) {
      loadAnalytics();
      return;
    }
    if (storedConsent === consentDeclined) return;
    createCookieBanner();
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setAppLinks(appUrl);
      enhanceUI();
      setupImageLightbox();
      initCookieConsent();
    });
  } else {
    setAppLinks(appUrl);
    enhanceUI();
    setupImageLightbox();
    initCookieConsent();
  }
})();
