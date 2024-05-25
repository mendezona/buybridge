import puppeteer from "puppeteer-core";

async function main(): Promise<void> {
  console.log("Hello, World!");
  const AUTH = `${process.env.BRIGHT_DATA_USERNAME}${process.env.BRIGHT_DATA_COUNTRY}:${process.env.BRIGHT_DATA_PASSWORD}`;
  const SBR_WS_ENDPOINT = `wss://${AUTH}@brd.superproxy.io:9222`;
  console.log("Starting the script...");

  try {
    console.log("Connecting to Scraping Browser...");
    const browser = await puppeteer.connect({
      browserWSEndpoint: SBR_WS_ENDPOINT,
    });

    console.log("Connected to browser");

    const page = await browser.newPage();
    console.log("New page opened");

    await page.goto("https://example.com", { timeout: 2 * 60 * 1000 });
    console.log("Navigated to https://example.com");

    console.log("Taking screenshot to page.png");
    await page.screenshot({ path: "./page.png", fullPage: true });
    console.log("Navigated! Scraping page content...");
    const html = await page.content();
    console.log("Page content:", html);

    await browser.close();
    console.log("Browser closed successfully");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main().catch((err) => {
  console.error("Error in main function:", err);
  process.exit(1);
});
