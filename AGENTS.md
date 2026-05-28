# AGENTS.md

Guidance for coding agents working in this repository.

## Project Summary

CaptionClip is a vanilla JavaScript browser extension for YouTube transcript export. It injects an in-page **Transcript** button and settings gear on YouTube watch pages. Users can save transcripts as TXT or SRT.

## Commands

~~~bash
npm install
npm run build
npm test
npm run test:chrome
npm run test:firefox
~~~

If Playwright reports a missing browser executable, run npx playwright install before rerunning integration tests.

## Files To Know

- src/content.js: all runtime extension behavior.
- src/manifests/manifest.chrome.json: Chrome Manifest V3 manifest.
- src/manifests/manifest.firefox.json: Firefox Manifest V2 manifest.
- scripts/build.js: rebuilds dist/chrome, dist/firefox, and zip files.
- docs/CHANGELOG.md: release notes for user-visible changes.
- dist/: generated extension output tracked in this repo.

## Development Rules

- Make behavior changes in src/content.js, then run npm run build.
- Do not edit dist/chrome/content.js or dist/firefox/content.js directly unless explicitly repairing generated output; source must remain authoritative.
- Update docs/CHANGELOG.md for user-visible behavior changes.
- Keep browser manifests and package.json versions aligned when bumping releases.
- Preserve both Chrome and Firefox compatibility.
- Keep the extension dependency-free and framework-free.
- Avoid innerHTML; use DOM APIs and textContent to remain compatible with YouTube Trusted Types restrictions.
- Do not restore the removed custom prepend setting. The settings panel should only control transcript output format.

## Verification Checklist

Before committing:

~~~bash
node --check src/content.js
node --check test-extension-complete.js
node --check test-extension-manual.js
npm run build
node --check dist/chrome/content.js
node --check dist/firefox/content.js
~~~

Run Playwright tests when the browser binaries are installed:

~~~bash
npm test
~~~

For manual testing, reload the unpacked extension in the browser, refresh the YouTube tab, choose TXT or SRT from the settings gear, then click **Transcript**.
