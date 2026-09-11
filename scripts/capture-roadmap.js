const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outputDir = path.join(__dirname, '..', 'captures');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Scroll down to reveal all elements and trigger ScrollReveal
  await page.evaluate(async () => {
    window.scrollTo(0, 1200);
  });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll specifically to #roadmap
  await page.evaluate(() => {
    const el = document.getElementById('roadmap');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot of Roadmap section
  const roadmapEl = await page.$('#roadmap');
  if (roadmapEl) {
    const screenshotPath = path.join(outputDir, 'roadmap-restored.png');
    await roadmapEl.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot to: ${screenshotPath}`);
  }

  // Capture a multi-frame visual sequence of the traveling dot animation
  console.log('Capturing animation frames of the connecting line & dot...');
  const frameDir = path.join(outputDir, 'roadmap_frames');
  if (!fs.existsSync(frameDir)) {
    fs.mkdirSync(frameDir, { recursive: true });
  }

  for (let i = 0; i < 15; i++) {
    const framePath = path.join(frameDir, `frame_${String(i + 1).padStart(3, '0')}.png`);
    await roadmapEl.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 600));
  }
  console.log('Finished capturing animation sequence.');

  await browser.close();
})();
