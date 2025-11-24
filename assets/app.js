(function () {
  // Determine app URL: ?app=... overrides saved setting, otherwise use localStorage, default to localhost
  const params = new URLSearchParams(location.search);
  const saved = localStorage.getItem('deployed_app_url');
  const paramUrl = params.get('app');
  const DEFAULT = 'http://localhost:3000';
  const appUrl = (paramUrl || saved || DEFAULT).trim();

  function setAppLinks(url) {
    document.querySelectorAll('a.open-app').forEach(a => {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  function enhanceUI() {
    const hint = document.querySelector('.hint');
    if (!hint) return;
    if (appUrl.includes('localhost')) {
      hint.textContent = hint.textContent + ' (currently pointing at localhost)';
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
        hint.textContent = 'App links now point to: ' + url.trim();
      };
      // try to insert into first .cta-row available
      const row = document.querySelector('.cta-row');
      if (row) row.appendChild(btn);
    } else {
      hint.textContent = 'App links point to: ' + appUrl;
    }
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { setAppLinks(appUrl); enhanceUI(); });
  } else {
    setAppLinks(appUrl); enhanceUI();
  }
})();