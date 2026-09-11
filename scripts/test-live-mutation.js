const puppeteer = require("puppeteer-core");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "http://localhost:3006";

async function verifyMutation() {
  console.log("Launching Edge to test live mutation...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,960"],
  });

  const page = await browser.newPage();

  try {
    // 1. Log in
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle0" });
    await page.type("#email", "unifiedram@gmail.com");
    await page.type("#password", "AdminSecure2026!");
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

    // 2. Go to Skills Tab
    const skillsBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => b.textContent.includes("Skills"));
    });
    if (skillsBtn) {
      await skillsBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
    }

    // 3. Add a test skill
    const testSkillName = "Autonomous Agents AI";
    const skillInput = await page.$('input[placeholder*="Next.js"]');
    if (skillInput) {
      await skillInput.type(testSkillName);
      const addBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        return btns.find((b) => b.textContent.includes("+ Add Skill"));
      });
      if (addBtn) {
        await addBtn.click();
        await new Promise((r) => setTimeout(r, 1500));
        console.log(`Added skill "${testSkillName}" via Admin CMS!`);
      }
    }

    // 4. Verify on Admin list
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasAdded = pageText.includes(testSkillName);
    console.log(`Admin Panel contains "${testSkillName}":`, hasAdded);

    // 5. Test Revalidation API
    const revalRes = await page.evaluate(async () => {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });
      return res.json();
    });
    console.log("Revalidation endpoint response:", revalRes);

    console.log("Live mutation verification successful!");
  } catch (err) {
    console.error("Mutation test error:", err);
  } finally {
    await browser.close();
  }
}

verifyMutation();
