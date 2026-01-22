# FMECA Tool landing page

Static single-page site describing the wind-turbine FMECA app (React frontend + Django API).

## Layout
- index.html: GitHub Pages entry point.
- 404.html: Redirects unknown routes back to / (friendly for SPA routing or deep links).
- fmea/index.html: FMEA Builder landing page (pretty URL at /fmea/).
- support/index.html: Support center (pretty URL at /support/).
- privacy/index.html: Privacy policy (pretty URL at /privacy/).
- terms/index.html: Terms of use (pretty URL at /terms/).
- assets/styles.css: Extracted styles.
- assets/app.js: Runtime helper that sets "Open the app" links and enforces new-tab behavior.

## Configuring the "Open the app" buttons
- Target URL: https://fmea.nevis.tools.
- Links always open in a new tab.

## Preview locally
Open index.html in your browser - no build step required.
