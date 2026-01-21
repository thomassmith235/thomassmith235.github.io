(function () {
  const appUrl = 'https://fmea.nevis.tools';

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

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { setAppLinks(appUrl); enhanceUI(); setupImageLightbox(); });
  } else {
    setAppLinks(appUrl); enhanceUI(); setupImageLightbox();
  }
})();
