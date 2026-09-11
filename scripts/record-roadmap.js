const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outputDir = path.join(__dirname, '..', 'captures');
  const recordFramesDir = path.join(outputDir, 'record_frames');

  if (fs.existsSync(recordFramesDir)) {
    fs.rmSync(recordFramesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(recordFramesDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Scroll to reveal elements
  await page.evaluate(() => {
    window.scrollTo(0, 1200);
    const el = document.getElementById('roadmap');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const roadmapEl = await page.$('#roadmap');
  console.log('Recording animation frames over 28s at 10fps (~280 frames)...');

  const totalFrames = 180; // 18 seconds of motion across curves and cards
  const frameIntervalMs = 100; // 10 fps

  for (let i = 0; i < totalFrames; i++) {
    const frameFile = path.join(recordFramesDir, `frame_${String(i).padStart(4, '0')}.png`);
    await roadmapEl.screenshot({ path: frameFile });
    await new Promise(r => setTimeout(r, frameIntervalMs));
  }

  await browser.close();
  console.log(`Saved ${totalFrames} frames.`);

  const mp4Path = path.join(outputDir, 'roadmap-animation.mp4');
  const gifPath = path.join(outputDir, 'roadmap-animation.gif');
  const ffmpegExe = 'C:\\Users\\dev\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-full_build\\bin\\ffmpeg.exe';

  console.log('Encoding MP4 recording with ffmpeg...');
  execSync(`"${ffmpegExe}" -y -framerate 10 -i "${path.join(recordFramesDir, 'frame_%04d.png')}" -c:v libx264 -pix_fmt yuv420p "${mp4Path}"`);
  console.log(`MP4 recording saved: ${mp4Path}`);

  console.log('Encoding GIF recording with ffmpeg...');
  execSync(`"${ffmpegExe}" -y -framerate 10 -i "${path.join(recordFramesDir, 'frame_%04d.png')}" -vf "fps=10,scale=1000:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${gifPath}"`);
  console.log(`GIF recording saved: ${gifPath}`);
})();
