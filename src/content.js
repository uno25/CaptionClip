(function() {
  if (window.__transcriptExtractorInitialized) {
    return;
  }
  window.__transcriptExtractorInitialized = true;


  function injectCaptionClipButton() {
    if (!window.location.href.includes('youtube.com/watch')) {
      return;
    }

    if (document.getElementById('captionclip-button')) {
      return;
    }
    
    // Remove existing settings panel if present
    const existingPanel = document.getElementById('captionclip-settings-panel');
    if (existingPanel) {
      existingPanel.remove();
    }
    
    const checkForButtonAnchor = setInterval(() => {
      const buttonAnchor = findCaptionClipInsertionAnchor();
      
      if (buttonAnchor) {
        clearInterval(checkForButtonAnchor);
        
        const htmlElement = document.documentElement;
        const bodyElement = document.body;
        const bodyStyles = window.getComputedStyle(bodyElement);
        const htmlStyles = window.getComputedStyle(htmlElement);
        
        let isDarkTheme = false;
        
        const ytdApp = document.querySelector('ytd-app');
        if (ytdApp) {
          isDarkTheme = ytdApp.hasAttribute('dark') || 
                       ytdApp.getAttribute('theme') === 'dark' ||
                       ytdApp.classList.contains('dark');
        }
        
        if (!isDarkTheme) {
          isDarkTheme = htmlElement.hasAttribute('dark') || 
                       htmlElement.getAttribute('theme') === 'dark' ||
                       htmlElement.classList.contains('dark') ||
                       bodyElement.getAttribute('theme') === 'dark' ||
                       bodyElement.classList.contains('dark');
        }
        
        if (!isDarkTheme) {
          const topBar = document.querySelector('#masthead, #container.ytd-masthead');
          if (topBar) {
            const topBarStyles = window.getComputedStyle(topBar);
            const topBarBg = topBarStyles.backgroundColor;
            isDarkTheme = topBarBg.includes('33, 33, 33') || 
                         topBarBg.includes('24, 24, 24') || 
                         topBarBg.includes('15, 15, 15') ||
                         topBarBg.includes('35, 35, 35');
          }
        }
        
        if (!isDarkTheme) {
          isDarkTheme = bodyStyles.backgroundColor.includes('24, 24, 24') ||
                       bodyStyles.backgroundColor.includes('15, 15, 15') ||
                       htmlStyles.backgroundColor.includes('24, 24, 24') ||
                       htmlStyles.backgroundColor.includes('15, 15, 15');
        }
        
        // Create container for button and settings
        const captionClipContainer = document.createElement('div');
        captionClipContainer.id = 'captionclip-container';
        captionClipContainer.style.cssText = `
          display: inline-flex !important;
          align-items: center !important;
          position: relative !important;
          margin-left: 8px !important;
        `;
        
        const captionClipButton = document.createElement('button');
        captionClipButton.id = 'captionclip-button';
        captionClipButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading';
        captionClipButton.setAttribute('aria-label', 'Extract transcript with CaptionClip');
        captionClipButton.setAttribute('title', 'Extract transcript with CaptionClip');
        
        const buttonStyles = isDarkTheme ? {
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.24)',
          color: '#ffffff',
          hoverBackground: 'rgba(255, 255, 255, 0.2)',
          shadow: 'none'
        } : {
          background: '#ffffff',
          border: '1px solid rgba(15, 15, 15, 0.28)',
          color: '#0f0f0f',
          hoverBackground: '#f2f2f2',
          shadow: '0 1px 2px rgba(15, 15, 15, 0.16)'
        };
        
        captionClipButton.style.cssText = `
          display: inline-flex !important;
          align-items: center !important;
          background: ${buttonStyles.background} !important;
          backdrop-filter: blur(2px) !important;
          border: ${buttonStyles.border} !important;
          border-radius: 18px !important;
          box-shadow: ${buttonStyles.shadow} !important;
          padding: 0 8px !important;
          height: 36px !important;
          font-family: Roboto, Arial, sans-serif !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          color: ${buttonStyles.color} !important;
          cursor: pointer !important;
          transition: background-color 0.3s ease, color 0.3s ease !important;
          min-width: auto !important;
          max-width: 120px !important;
        `;
        
        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = `
          display: flex !important;
          align-items: center !important;
          margin-right: 4px !important;
          width: 20px !important;
          height: 20px !important;
        `;
        
        iconContainer.appendChild(createSvgIcon('M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z', 20));
        
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Transcript';
        textSpan.style.cssText = 'white-space: nowrap !important;';
        
        captionClipButton.onmouseenter = () => {
          captionClipButton.style.setProperty('background', buttonStyles.hoverBackground, 'important');
        };
        captionClipButton.onmouseleave = () => {
          captionClipButton.style.setProperty('background', buttonStyles.background, 'important');
        };
        
        captionClipButton.appendChild(iconContainer);
        captionClipButton.appendChild(textSpan);
        
        // Create settings button
        const settingsButton = document.createElement('button');
        settingsButton.id = 'captionclip-settings-button';
        settingsButton.setAttribute('aria-label', 'CaptionClip settings');
        settingsButton.setAttribute('title', 'Choose transcript save format');
        settingsButton.style.cssText = `
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: ${buttonStyles.background} !important;
          backdrop-filter: blur(2px) !important;
          border: ${buttonStyles.border} !important;
          border-radius: 18px !important;
          box-shadow: ${buttonStyles.shadow} !important;
          padding: 0 !important;
          width: 36px !important;
          height: 36px !important;
          margin-left: 4px !important;
          color: ${buttonStyles.color} !important;
          cursor: pointer !important;
          transition: background-color 0.3s ease, color 0.3s ease !important;
        `;
        
        settingsButton.appendChild(createSvgIcon('M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z', 16));
        
        settingsButton.onmouseenter = () => {
          settingsButton.style.setProperty('background', buttonStyles.hoverBackground, 'important');
        };
        settingsButton.onmouseleave = () => {
          settingsButton.style.setProperty('background', buttonStyles.background, 'important');
        };
        
        // Create settings panel
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'captionclip-settings-panel';
        settingsPanel.style.cssText = `
          position: absolute !important;
          top: 45px !important;
          right: 0 !important;
          background: ${isDarkTheme ? '#212121' : '#ffffff'} !important;
          border: 1px solid ${isDarkTheme ? '#404040' : '#e0e0e0'} !important;
          border-radius: 8px !important;
          padding: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          z-index: 9999 !important;
          min-width: 220px !important;
          display: none !important;
          font-family: Roboto, Arial, sans-serif !important;
          color: ${isDarkTheme ? '#e0e0e0' : '#303030'} !important;
        `;
        
        const settingsLabel = document.createElement('div');
        settingsLabel.textContent = 'Save as:';
        settingsLabel.style.cssText = `
          display: block !important;
          margin-bottom: 8px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          color: ${isDarkTheme ? '#e0e0e0' : '#303030'} !important;
        `;

        const formatOptions = document.createElement('div');
        formatOptions.style.cssText = `
          display: grid !important;
          gap: 8px !important;
        `;

        const txtOption = createFormatOption('txt', 'TXT', 'Plain text without timings', isDarkTheme);
        const srtOption = createFormatOption('srt', 'SRT', 'Subtitles with timings', isDarkTheme);

        formatOptions.appendChild(txtOption.label);
        formatOptions.appendChild(srtOption.label);
        settingsPanel.appendChild(settingsLabel);
        settingsPanel.appendChild(formatOptions);
        
        // Settings button click handler
        settingsButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = settingsPanel.style.display !== 'none';
          settingsPanel.style.display = isVisible ? 'none' : 'block';
          if (!isVisible) {
            syncFormatOptions();
          }
        });

        [txtOption.input, srtOption.input].forEach(input => {
          input.addEventListener('change', () => {
            if (input.checked) {
              localStorage.setItem('captionclip-format', input.value);
              updateButtonText();
              settingsPanel.style.display = 'none';
            }
          });
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
          if (!captionClipContainer.contains(e.target)) {
            settingsPanel.style.display = 'none';
          }
        });
        
        function syncFormatOptions() {
          const format = getSelectedFormat();
          txtOption.input.checked = format === 'txt';
          srtOption.input.checked = format === 'srt';
        }

        function updateButtonText() {
          const format = getSelectedFormat().toUpperCase();
          textSpan.textContent = 'Transcript';
          captionClipButton.setAttribute('title', `Extract transcript and save as ${format}`);
        }
        
        // Initialize button text
        syncFormatOptions();
        updateButtonText();
        
        captionClipButton.addEventListener('click', async () => {
          captionClipButton.disabled = true;
          const originalText = textSpan.textContent;
          textSpan.textContent = 'Extracting...';
          
          try {
            const transcript = await openAndExtractTranscript(getSelectedFormat());
            
            saveTranscriptToFile(transcript.content, transcript.extension);
            try {
              await copyToClipboard(transcript.content);
            } catch (copyError) {
              showToast('Transcript saved. Clipboard copy failed.');
            }
            
            textSpan.textContent = '✓ Saved!';
            captionClipButton.style.setProperty('background', '#4caf50', 'important');
            captionClipButton.style.setProperty('color', 'white', 'important');
            
            setTimeout(() => {
              captionClipButton.style.setProperty('background', buttonStyles.background, 'important');
              captionClipButton.style.setProperty('color', buttonStyles.color, 'important');
              
              setTimeout(() => {
                textSpan.textContent = originalText;
                captionClipButton.disabled = false;
              }, 300);
            }, 2000);
            
          } catch (error) {
            textSpan.textContent = '✗ Failed';
            captionClipButton.style.setProperty('background', '#f44336', 'important');
            captionClipButton.style.setProperty('color', 'white', 'important');
            
            showToast(`Error: ${error.message}`, 'error');
            
            setTimeout(() => {
              captionClipButton.style.setProperty('background', buttonStyles.background, 'important');
              captionClipButton.style.setProperty('color', buttonStyles.color, 'important');
              
              setTimeout(() => {
                textSpan.textContent = originalText;
                captionClipButton.disabled = false;
              }, 300);
            }, 2000);
          }
        });
        
        // Add elements to container
        captionClipContainer.appendChild(captionClipButton);
        captionClipContainer.appendChild(settingsButton);
        captionClipContainer.appendChild(settingsPanel);
        
        const insertionParent = buttonAnchor.parentElement;
        if (insertionParent) {
          insertionParent.insertBefore(captionClipContainer, buttonAnchor.nextSibling);
        } else {
          buttonAnchor.parentNode.insertBefore(captionClipContainer, buttonAnchor.nextSibling);
        }
      }
    }, 1000);
    
    setTimeout(() => clearInterval(checkForButtonAnchor), 30000);
  }

  function findCaptionClipInsertionAnchor() {
    const anchors = [
      '#voice-search-button',
      '#end #buttons ytd-button-renderer',
      '#end #buttons button',
      'ytd-masthead #buttons ytd-button-renderer',
      'ytd-masthead #buttons button'
    ];

    for (const selector of anchors) {
      const anchor = document.querySelector(selector);
      if (anchor) {
        return anchor;
      }
    }

    return null;
  }

  function createSvgIcon(pathData, size) {
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('height', String(size));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', String(size));
    svg.style.fill = 'currentColor';

    const path = document.createElementNS(namespace, 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);

    return svg;
  }

  function createFormatOption(value, title, description, isDarkTheme) {
    const label = document.createElement('label');
    label.style.cssText = `
      display: grid !important;
      grid-template-columns: auto 1fr !important;
      column-gap: 8px !important;
      align-items: start !important;
      padding: 8px !important;
      border: 1px solid ${isDarkTheme ? '#404040' : '#d8d8d8'} !important;
      border-radius: 6px !important;
      cursor: pointer !important;
      color: ${isDarkTheme ? '#e0e0e0' : '#303030'} !important;
    `;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'captionclip-format';
    input.value = value;
    input.style.cssText = 'margin: 2px 0 0 0 !important;';

    const text = document.createElement('span');
    const titleElement = document.createElement('strong');
    titleElement.textContent = title;
    titleElement.style.cssText = 'display: block !important; font-size: 13px !important; line-height: 16px !important;';

    const descriptionElement = document.createElement('span');
    descriptionElement.textContent = description;
    descriptionElement.style.cssText = 'display: block !important; font-size: 12px !important; line-height: 16px !important; opacity: 0.78 !important;';

    text.appendChild(titleElement);
    text.appendChild(descriptionElement);
    label.appendChild(input);
    label.appendChild(text);

    return { label, input };
  }

  function getSelectedFormat() {
    return localStorage.getItem('captionclip-format') === 'srt' ? 'srt' : 'txt';
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch (e) {
    }
    
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 1px;
      height: 1px;
      padding: 0;
      border: none;
      outline: none;
      box-shadow: none;
      background: transparent;
      z-index: -1;
    `;
    
    document.body.appendChild(textarea);
    
    textarea.focus();
    textarea.select();
    
    if (textarea.setSelectionRange) {
      textarea.setSelectionRange(0, textarea.value.length);
    }
    
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (copyError) {
    }
    
    document.body.removeChild(textarea);
    
    if (!success) {
      throw new Error('Failed to copy to clipboard');
    }
  }

  function saveTranscriptToFile(text, extension = 'txt') {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = getTranscriptFilenameBase() + '.' + extension;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function getTranscriptFilenameBase() {
    const title = document.querySelector('h1 yt-formatted-string')?.textContent ||
                  document.title ||
                  'youtube-transcript';
    const cleanTitle = title
      .replace(/\s*-\s*YouTube\s*$/i, '')
      .replace(/[\\/:*?"<>|]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return cleanTitle || 'youtube-transcript';
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#dc2626' : '#16a34a'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 999999;
      animation: slideIn 0.3s ease-out;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out forwards';
      setTimeout(() => {
        document.body.removeChild(toast);
        document.head.removeChild(style);
      }, 300);
    }, 3000);
  }


  injectCaptionClipButton();
  
  setTimeout(() => {
    injectCaptionClipButton();
  }, 2000);

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(injectCaptionClipButton, 1000);
    }
  }).observe(document, { subtree: true, childList: true });

async function openAndExtractTranscript(format = 'txt') {
  if (!window.location.href.includes("youtube.com/watch")) {
    throw new Error("Not a YouTube video page");
  }

  if (!hasTranscriptReady()) {
    await tryOpenTranscriptPanel();
  }

  await waitForTranscriptReady(12000)
    .catch(() => {
      throw new Error("Transcript panel not found or did not render text. Open the transcript panel and try again.");
    });

  const segments = extractTranscriptSegments();
  if (segments.length > 0) {
    if (format === 'srt') {
      const srt = buildSrtTranscript(segments);
      if (!srt) {
        throw new Error('Transcript timings could not be extracted for SRT output.');
      }
      return { content: srt, extension: 'srt' };
    }

    return { content: segments.map(segment => segment.text).join(' '), extension: 'txt' };
  }

  const transcript = extractYouTubeTranscript();
  if (!transcript) {
    throw new Error("Transcript panel was found, but no transcript text could be extracted.");
  }

  return { content: transcript, extension: 'txt' };
}

async function tryOpenTranscriptPanel() {
  try {
    const success = await tryOpenViaShowTranscriptButton();
    if (success) {
      return true;
    }
  } catch (e) {
  }

  throw new Error("Could not open transcript panel");
}


async function tryOpenViaShowTranscriptButton() {
  const transcriptButton = document.querySelector("ytd-video-description-transcript-section-renderer button[aria-label=\"Show transcript\"], ytd-video-description-transcript-section-renderer button");
  
  if (transcriptButton && isShowTranscriptButton(transcriptButton)) {
    transcriptButton.scrollIntoView({ block: "center", inline: "nearest" });
    transcriptButton.click();
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }

  const buttons = Array.from(document.querySelectorAll("button, yt-button-renderer button, ytd-button-renderer button"));

  for (const button of buttons) {
    if (button.id && button.id.startsWith("captionclip-")) {
      continue;
    }

    if (button.closest("#captionclip-container")) {
      continue;
    }

    const text = button.textContent.toLowerCase();
    const ariaLabel = button.getAttribute("aria-label")?.toLowerCase() || "";
    if (isShowTranscriptButton(button) ||
        text.trim() === "transcript" ||
        ariaLabel.trim() === "transcript") {
      button.scrollIntoView({ block: "center", inline: "nearest" });
      button.click();

      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    }
  }

  throw new Error("Direct transcript button not found");
}

function isShowTranscriptButton(button) {
  const text = button.textContent.toLowerCase().trim();
  const ariaLabel = button.getAttribute("aria-label")?.toLowerCase().trim() || "";

  return text === "show transcript" ||
         ariaLabel === "show transcript" ||
         text.includes("show transcript") ||
         ariaLabel.includes("show transcript");
}

function extractYouTubeTranscript() {
  const modernTranscript = extractModernYouTubeTranscript();
  if (modernTranscript) {
    return modernTranscript;
  }

  const segmentsContainer = document.getElementById("segments-container");
  if (!segmentsContainer) {
    return "";
  }
  
  const segments = segmentsContainer.querySelectorAll("ytd-transcript-segment-renderer");

  if (segments.length === 0) {
    return "";
  }

  const transcriptParts = [];
  segments.forEach(segment => {
    const textElement = segment.querySelector("div > yt-formatted-string");
    if (textElement) {
      transcriptParts.push(textElement.textContent.trim());
    }
  });

  return transcriptParts.join(" ");
}

function extractModernYouTubeTranscript() {
  return extractTranscriptSegments()
    .map(segment => segment.text)
    .join(' ');
}

function extractTranscriptSegments() {
  const panel = findTranscriptPanel();
  const panelSegments = panel
    ? extractSegmentsFromHosts(panel.querySelectorAll(getTranscriptSegmentSelectors().join(", ")))
    : [];

  if (panelSegments.length > 0) {
    return panelSegments;
  }

  const pageSegments = extractSegmentsFromHosts(document.querySelectorAll(getTranscriptSegmentSelectors().join(", ")));
  if (pageSegments.length > 0) {
    return pageSegments;
  }

  return panel ? extractSegmentsFromPanelText(panel) : [];
}

function extractSegmentsFromHosts(segmentHosts) {
  const seen = new Set();
  const segments = [];

  Array.from(segmentHosts).forEach(segment => {
    const visibleText = getVisibleText(segment);
    const start = parseTranscriptTimestamp(getFirstTimestampLine(visibleText));
    const explicitTextNodes = Array.from(segment.querySelectorAll("[role=\"text\"], .ytAttributedStringHost, yt-formatted-string, .segment-text"))
      .filter(node => !isTranscriptTimestampText(getVisibleText(node)));

    const text = (explicitTextNodes.length ? explicitTextNodes : [segment])
      .map(getVisibleText)
      .map(removeTranscriptTimestampLines)
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!text || isTranscriptChromeText(text)) {
      return;
    }

    const key = String(start ?? 'none') + '|' + text;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    segments.push({ start, text });
  });

  return segments;
}

function extractTranscriptFromPanelText(panel) {
  return extractSegmentsFromPanelText(panel)
    .map(segment => segment.text)
    .join(" ");
}

function extractSegmentsFromPanelText(panel) {
  const lines = (panel.innerText || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const segments = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (!isTranscriptTimestampText(lines[index])) {
      continue;
    }

    const nextLines = [];
    for (let offset = 1; offset <= 3 && lines[index + offset]; offset += 1) {
      const candidate = lines[index + offset];
      if (isTranscriptTimestampText(candidate)) {
        break;
      }
      if (!isTranscriptChromeText(candidate)) {
        nextLines.push(candidate);
      }
    }

    if (nextLines.length > 0) {
      segments.push({
        start: parseTranscriptTimestamp(lines[index]),
        text: nextLines.join(" ")
      });
    }
  }

  return segments;
}

function buildSrtTranscript(segments) {
  return segments
    .filter(segment => typeof segment.start === 'number')
    .map((segment, index, timedSegments) => {
      const nextSegment = timedSegments[index + 1];
      const end = nextSegment && nextSegment.start > segment.start
        ? nextSegment.start
        : segment.start + 3;

      return [
        String(index + 1),
        formatSrtTime(segment.start) + " --> " + formatSrtTime(end),
        segment.text
      ].join("\n");
    })
    .join("\n\n");
}

function findTranscriptPanel() {
  const panels = Array.from(document.querySelectorAll([
    "ytd-engagement-panel-section-list-renderer[target-id=\"PAmodern_transcript_view\"]",
    "ytd-engagement-panel-section-list-renderer[target-id=\"engagement-panel-searchable-transcript\"]",
    "ytd-transcript-search-panel-renderer",
    "ytd-transcript-renderer",
    "[target-id*=\"transcript\"]",
    "[aria-label*=\"Transcript\" i]"
  ].join(", ")));

  return panels.find(panel => panelHasTranscriptText(panel)) ||
         panels.find(panel => extractSegmentsFromHosts(panel.querySelectorAll(getTranscriptSegmentSelectors().join(", "))).length > 0) ||
         panels.find(isVisibleElement) ||
         panels[0] ||
         null;
}

function getTranscriptSegmentSelectors() {
  return [
    "transcript-segment-view-model",
    ".ytwTranscriptSegmentViewModelHost",
    "ytd-transcript-segment-renderer",
    "ytd-transcript-segment-list-renderer ytd-transcript-segment-renderer",
    "#segments-container ytd-transcript-segment-renderer"
  ];
}

function hasTranscriptReady() {
  const panel = findTranscriptPanel();
  return !!(panel && panelHasTranscriptText(panel)) ||
         extractSegmentsFromHosts(document.querySelectorAll(getTranscriptSegmentSelectors().join(", "))).length > 0;
}

function panelHasTranscriptText(panel) {
  const text = panel.innerText || "";
  return /\d{1,2}:\d{2}/.test(text) && text.split("\n").filter(Boolean).length > 2;
}

function isTranscriptTimestampText(text) {
  return /^\d{1,2}:\d{2}(?::\d{2})?$/.test((text || "").trim());
}

function isTranscriptChromeText(text) {
  return /^(Transcript|Search transcript|Sync to video time|Show transcript)$/i.test((text || "").trim());
}

function getVisibleText(element) {
  return (element.innerText || element.textContent || "").trim();
}

function getFirstTimestampLine(text) {
  return (text || '')
    .split("\n")
    .map(line => line.trim())
    .find(isTranscriptTimestampText) || '';
}

function parseTranscriptTimestamp(text) {
  const parts = (text || '').trim().split(':').map(Number);
  if (parts.some(part => Number.isNaN(part))) {
    return null;
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return null;
}

function formatSrtTime(seconds) {
  const milliseconds = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const wholeSeconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;

  return [hours, minutes, wholeSeconds]
    .map(value => String(value).padStart(2, '0'))
    .join(':') + ',' + String(ms).padStart(3, '0');
}

function removeTranscriptTimestampLines(text) {
  return (text || "")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !isTranscriptTimestampText(line) && !isTranscriptChromeText(line))
    .join(" ")
    .trim();
}

function waitForTranscriptReady(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkTranscript = () => {
      if (hasTranscriptReady()) {
        resolve(true);
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error("Timeout waiting for transcript panel"));
        return;
      }

      setTimeout(checkTranscript, 300);
    };

    checkTranscript();
  });
}

function isVisibleElement(element) {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

function waitForTranscriptSegments(timeout = 10000) {
  return waitForAnyElement([
    'ytd-engagement-panel-section-list-renderer[target-id="PAmodern_transcript_view"] transcript-segment-view-model',
    'ytd-engagement-panel-section-list-renderer[target-id="PAmodern_transcript_view"] .ytwTranscriptSegmentViewModelHost',
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"] transcript-segment-view-model',
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"] .ytwTranscriptSegmentViewModelHost',
    '#segments-container ytd-transcript-segment-renderer'
  ], timeout);
}

function waitForAnyElement(selectors, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkElement = () => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for elements: ${selectors.join(', ')}`));
        return;
      }

      setTimeout(checkElement, 300);
    };

    checkElement();
  });
}

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    if (document.querySelector(selector)) {
      resolve(document.querySelector(selector));
      return;
    }

    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for element: ${selector}`));
        return;
      }

      setTimeout(checkElement, 300);
    };

    checkElement();
  });
}

})();
