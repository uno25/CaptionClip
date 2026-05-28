const { chromium } = require('playwright');
const path = require('path');

async function testExtension() {
  console.log('Starting extension test...');
  
  try {
    // Launch browser with extension
    const context = await chromium.launchPersistentContext(
      path.join(__dirname, 'temp-profile'), 
      {
        headless: false,
        args: [
          `--load-extension=${path.join(__dirname, 'dist', 'chrome')}`,
          '--disable-extensions-except=' + path.join(__dirname, 'dist', 'chrome'),
          '--disable-dev-shm-usage',
          '--no-sandbox'
        ]
      }
    );

    const page = await context.newPage();
    
    // Navigate to a YouTube video
    console.log('Navigating to YouTube video...');
    await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if the CaptionClip button appears
    console.log('Looking for CaptionClip button...');
    const captionClipButton = await page.locator('#captionclip-button').first();
    
    if (await captionClipButton.isVisible()) {
      console.log('✓ CaptionClip button found!');
      
      // Check for settings button
      const settingsButton = await page.locator('#captionclip-settings-button').first();
      if (await settingsButton.isVisible()) {
        console.log('✓ Settings button found!');
        
        // Test settings functionality
        console.log('Testing settings panel...');
        await settingsButton.click();
        await page.waitForTimeout(500);
        
        const settingsPanel = await page.locator('#captionclip-settings-panel').first();
        if (await settingsPanel.isVisible()) {
          console.log('✓ Settings panel opens correctly!');
          
          const srtOption = await settingsPanel.locator('input[value="srt"]').first();
          await srtOption.check();
          await page.waitForTimeout(500);
          
          const storedFormat = await page.evaluate(() => localStorage.getItem('captionclip-format'));
          if (storedFormat === 'srt') {
            console.log('✓ SRT format saved correctly!');
          } else {
            console.log('✗ Format setting did not change. Current value:', storedFormat);
          }
        } else {
          console.log('✗ Settings panel did not open');
        }
      } else {
        console.log('✗ Settings button not found');
      }
    } else {
      console.log('✗ CaptionClip button not found');
    }
    
    // Keep browser open for manual inspection
    console.log('\nTest complete! Browser will stay open for manual inspection.');
    console.log('Press Ctrl+C to close when done.');
    
    // Wait indefinitely
    await new Promise(() => {});
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testExtension();