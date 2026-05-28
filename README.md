# CaptionClip

CaptionClip is a Chrome and Firefox extension that saves YouTube transcripts from a single in-page button.

The extension injects a **Transcript** button into YouTube video pages. Click the button to extract the available YouTube transcript, save it as a file, and copy the same content to the clipboard when clipboard access is available.

## Features

- Adds a **Transcript** button directly to YouTube watch pages.
- Saves transcripts as TXT without timings or SRT with subtitle timings.
- Uses a settings gear beside the Transcript button to choose the save format.
- Remembers the selected format in browser local storage.
- Copies the saved transcript content to the clipboard as a best-effort fallback.
- Supports Chrome Manifest V3 and Firefox Manifest V2 from one source file.

## Installation

### Chrome

1. Build the extension:

~~~bash
npm run build
~~~

2. Open chrome://extensions/.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the dist/chrome folder.
6. Refresh any open YouTube tabs after reloading the extension.

### Firefox

1. Build the extension:

~~~bash
npm run build
~~~

2. Open about:debugging.
3. Click **This Firefox**.
4. Click **Load Temporary Add-on**.
5. Select dist/firefox/manifest.json.
6. Refresh any open YouTube tabs after reloading the extension.

## Usage

1. Open a YouTube video with an available transcript.
2. Optional: click the settings gear beside **Transcript** and choose:
   - **TXT**: plain transcript text without timings.
   - **SRT**: subtitle file with timings.
3. Click **Transcript**.
4. CaptionClip opens YouTube's transcript panel when needed, extracts the transcript, downloads the selected file type, and attempts to copy the same content to the clipboard.

The browser toolbar icon can appear gray because CaptionClip does not use a toolbar popup. The extension runs as a content script on YouTube watch pages.

## Troubleshooting

- **Transcript button does not appear**: refresh the YouTube tab after loading or reloading the extension.
- **No transcript found**: confirm YouTube itself offers a transcript for the video.
- **SRT export fails**: the current YouTube transcript DOM may not expose usable timing data. Try TXT or report the page structure.
- **Clipboard copy fails**: the downloaded transcript file is still the source of truth; clipboard copy is best effort.
- **Playwright tests fail with missing browser**: run npx playwright install before running the browser integration tests.

## Development

Install dependencies:

~~~bash
npm install
~~~

Build browser distributions and zip files:

~~~bash
npm run build
~~~

Run tests:

~~~bash
npm test
npm run test:chrome
npm run test:firefox
~~~

The build copies src/content.js and the browser-specific manifest from src/manifests/ into dist/chrome and dist/firefox, then creates zip files in dist/.
