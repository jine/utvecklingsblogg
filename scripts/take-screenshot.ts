import { chromium } from "@playwright/test";

/**
 * This script uses Playwright to take a screenshot of the homepage of the blog and saves it to the public folder.
 * The screenshot is taken at a viewport size of 1280x1080 and includes the full page.
 *
 * To run this script, use the command: `npx ts-node scripts/take-screenshot.ts`
 * Make sure you have Playwright installed and set up in your project before running the script.
 *
 * @author Jim Nelin <jim@jine.se>
 */
async function takeScreenshot() {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1280, height: 1080 },
    });
    const page = await context.newPage();

    await page.goto("https://blogg.nattsken.se");
    await page.waitForLoadState("networkidle");

    // Take screenshot and save to public folder
    await page.screenshot({
        path: "public/screenshot.png",
        fullPage: true,
    });

    console.log("Screenshot saved to public/screenshot.png");

    await browser.close();
}

takeScreenshot().catch(console.error);
