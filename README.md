# FMECA Tool landing page

Static single-page site describing the wind-turbine FMECA app (React frontend + Django API).

## Layout
- index.html: GitHub Pages entry point.
- 404.html: Redirects unknown routes back to / (friendly for SPA routing or deep links).
- assets/styles.css: Extracted styles.
- assets/app.js: Runtime helper that swaps the "Open the app" links to a custom URL and enforces new-tab behavior.

## Configuring the "Open the app" buttons
- Default target: http://localhost:3000.
- Override per-visit: append ?app=https://your-domain.example to the page URL.
- Persist a deployed URL: click "Use deployed URL"; it stores the value in localStorage and updates all open-app links.
- Links always open in a new tab for both local and deployed URLs.

## Preview locally
Open index.html in your browser?no build step required.
