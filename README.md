# FMECA Tool landing page

Static single-page site describing the wind-turbine FMECA app (React frontend + Django API).

## Files
- index.html: GitHub Pages entry point; same content as home.html.
- home.html: Main page with inline styles and the runtime app URL helper.

## Configuring the "Open the app" buttons
- Default target: http://localhost:3000.
- Override per-visit: append ?app=https://your-domain.example to the URL.
- Persist a deployed URL: click "Use deployed URL"; it stores the value in localStorage and updates all open-app links.
- Links always open in a new tab for both local and deployed URLs.

## Preview locally
Just open home.html or index.html in your browser—no build step required.
