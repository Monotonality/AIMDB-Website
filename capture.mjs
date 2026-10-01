import { chromium } from "playwright";

const base = "http://localhost:3111";
const out = ".impeccable/review";

const browser = await chromium.launch();

async function shoot(name, width, height, fullPage) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
  });
  // networkidle never settles: the live reading polls every 2.4s
  await page.goto(base, { waitUntil: "domcontentloaded" });
  // let entrance animation settle before capture
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage });
  await page.close();
  console.log(`captured ${name}.png`);
}

await shoot("desktop", 1440, 900, true);
await shoot("mobile", 390, 844, true);

await browser.close();