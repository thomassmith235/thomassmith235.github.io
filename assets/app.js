(function () {
  // Determine app URL: ?app=... overrides saved setting, otherwise use localStorage, default to localhost
  const params = new URLSearchParams(location.search);
  const saved = localStorage.getItem('deployed_app_url');
  const paramUrl = params.get('app');
  const DEFAULT = 'http://localhost:3000';
  const appUrl = (paramUrl || saved || DEFAULT).trim();

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

    if (appUrl.includes('localhost')) {
      hint.textContent = hint.textContent + ` (currently pointing at ${resolvedLink})`;
      // add small control to quickly set a deployed URL
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Use deployed URL';
      btn.className = 'cta ghost';
      btn.style.marginLeft = '12px';
      btn.onclick = function () {
        const url = prompt('Paste deployed app URL (https://your-domain.example):');
        if (!url) return;
        localStorage.setItem('deployed_app_url', url.trim());
        setAppLinks(url.trim());
        hint.textContent = 'App links now point to: ' + buildUrl(url.trim(), linkPath);
      };
      // try to insert into first .cta-row available
      const row = document.querySelector('.cta-row');
      if (row) row.appendChild(btn);
    } else {
      hint.textContent = 'App links point to: ' + resolvedLink;
    }
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { setAppLinks(appUrl); enhanceUI(); });
  } else {
    setAppLinks(appUrl); enhanceUI();
  }
})();
