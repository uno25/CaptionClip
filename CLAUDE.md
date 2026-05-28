# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

CaptionClip is a cross-browser extension that extracts transcripts from YouTube videos and saves them as TXT or SRT. It supports Chrome with Manifest V3 and Firefox with Manifest V2 from a single vanilla JavaScript content script.

## Key Commands

~~~bash
# Install dependencies
npm install

# Build for both browsers, creating dist/chrome, dist/firefox, and zip files
npm run build

# Run tests for both browsers
npm test

# Run Chrome-specific tests
npm run test:chrome

# Run Firefox-specific tests
npm run test:firefox
~~~

Playwright tests require installed browser binaries. If tests fail because Chromium or Firefox is missing, run npx playwright install.

## Architecture

The extension uses a simple dependency-free architecture:

- **Single content script**: src/content.js injects the YouTube UI, stores settings, extracts transcripts, saves files, and copies content to the clipboard.
- **No background scripts or service workers**: all runtime behavior lives in the content script.
- **Pure vanilla JavaScript**: no bundler or framework is used.
- **Browser-specific manifests**: src/manifests/manifest.chrome.json and src/manifests/manifest.firefox.json are copied into dist/ by the build script.

## Core Behavior

- Injects a **Transcript** button beside YouTube top-bar controls on youtube.com/watch pages.
- Injects a settings gear beside the Transcript button.
- Settings store captionclip-format in page local storage. Valid values are txt and srt; default is txt.
- TXT export saves transcript text without timings.
- SRT export extracts segment start times and text, then infers each cue end time from the next segment start time.
- File downloads use a generated anchor download link and a Blob URL.
- Clipboard copy is best effort and should not be treated as the primary save path.

## Important Files

- src/content.js: main extension logic and YouTube transcript extraction.
- src/manifests/: browser-specific extension manifests.
- scripts/build.js: copies source into dist/ and creates zip files.
- tests/: Playwright integration tests that load built extension files.
- docs/CHANGELOG.md: release notes; update it for user-visible changes.
- dist/: generated extension folders and zip files. This repo currently tracks built artifacts, so rebuild before committing release changes.

## Development Workflow

1. Make source changes in src/.
2. Update tests and docs when behavior changes.
3. Run syntax checks when relevant:

~~~bash
node --check src/content.js
node --check test-extension-complete.js
node --check test-extension-manual.js
~~~

4. Run npm run build to refresh dist/.
5. Run node --check dist/chrome/content.js and node --check dist/firefox/content.js after build.
6. Run Playwright tests when browser binaries are available.
7. Reload the unpacked browser extension and refresh YouTube tabs for manual verification.

## Constraints And Cautions

- YouTube DOM selectors are fragile. Preserve fallback extraction paths when changing transcript logic.
- Keep DOM creation Trusted Types-safe: use document.createElement, textContent, attributes, and styles instead of innerHTML.
- Do not reintroduce custom prepend behavior; settings are for output format only.
- Keep Chrome and Firefox builds in sync by editing src/ and rebuilding, not by editing only dist/.
- The toolbar icon may be gray because the extension has no toolbar popup or action UI; the in-page Transcript button is the primary interface.
