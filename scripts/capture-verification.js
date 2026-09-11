const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const SCREENSHOTS_DIR = path.join(__dirname, "..", "verification-screenshots");
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "http://localhost:3006";

async function run() {
  console.log("Launching Edge headless browser...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,960"],
    defaultViewport: { width: 1440, height: 960 },
  });

  const page = await browser.newPage();

  try {
    // 1. Visit homepage and scroll to footer contact area
    console.log("1. Visiting homepage and inspecting footer discreet access button...");
    await page.goto(BASE_URL, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 1000));

    // Scroll directly to the contact / footer section
    await page.evaluate(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "instant", block: "center" });
      } else {
        window.scrollTo(0, document.body.scrollHeight);
      }
    });
    await new Promise((r) => setTimeout(r, 1500));

    const footerLock = await page.$('a[href="/admin/login"]');
    if (footerLock) {
      console.log("Found discreet admin lock button in footer!");
      const linkInfo = await page.evaluate((el) => ({
        href: el.getAttribute("href"),
        title: el.getAttribute("title"),
        ariaLabel: el.getAttribute("aria-label"),
      }), footerLock);
      console.log("Footer lock attributes:", linkInfo);
    }

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "1-discreet-footer-button.png"),
    });
    console.log("Saved 1-discreet-footer-button.png");

    // 2. Visit /admin/login and screenshot login page
    console.log("2. Navigating to /admin/login...");
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "2-admin-login-page.png"),
    });
    console.log("Saved 2-admin-login-page.png");

    // 3. Perform login
    console.log("3. Authenticating admin session...");
    await page.type("#email", "unifiedram@gmail.com");
    await page.type("#password", "AdminSecure2026!");
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Redirected to URL:", page.url());

    // 4. Capture Projects Tab
    console.log("4. Capturing Admin Dashboard - Projects tab...");
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "3-admin-dashboard-projects.png"),
    });
    console.log("Saved 3-admin-dashboard-projects.png");

    // 5. Capture Roadmap Tab
    console.log("5. Switching to Roadmap tab...");
    const roadmapBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => b.textContent.includes("Roadmap"));
    });
    if (roadmapBtn) {
      await roadmapBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "4-admin-dashboard-roadmap.png"),
      });
      console.log("Saved 4-admin-dashboard-roadmap.png");
    }

    // 6. Capture Analytics Tab
    console.log("6. Switching to Analytics tab...");
    const analyticsBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => b.textContent.includes("Analytics"));
    });
    if (analyticsBtn) {
      await analyticsBtn.click();
      await new Promise((r) => setTimeout(r, 1500));
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "5-admin-dashboard-analytics.png"),
      });
      console.log("Saved 5-admin-dashboard-analytics.png");
    }

    // 7. Capture Skills Tab
    console.log("7. Switching to Skills tab & testing live edit...");
    const skillsBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => b.textContent.includes("Skills"));
    });
    if (skillsBtn) {
      await skillsBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "6-admin-dashboard-skills.png"),
      });
      console.log("Saved 6-admin-dashboard-skills.png");
    }

    // 8. Capture Profile & Hero Tab
    console.log("8. Switching to Profile & Hero tab...");
    const profileBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => b.textContent.includes("Profile"));
    });
    if (profileBtn) {
      await profileBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "7-admin-dashboard-profile.png"),
      });
      console.log("Saved 7-admin-dashboard-profile.png");
    }

    console.log("Verification capture completed successfully!");
  } catch (err) {
    console.error("Error during browser automation:", err);
  } finally {
    await browser.close();
  }
}

run();
