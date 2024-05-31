import puppeteer from "puppeteer-core";
import { type KauflandProductData } from "./kauflandScrapper.types";

export async function kauflandScrapper({
  ean,
}: {
  ean: string;
}): Promise<KauflandProductData> {
  console.log("Kaufland Scrapper initiated");
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

    await page.goto(`https://www.kaufland.de/s/?search_value=${ean}`, {
      timeout: 2 * 60 * 1000,
    });
    console.log(`Navigated to https://www.kaufland.de/s/?search_value=${ean}`);

    const cookiesAcceptButtonId = "#onetrust-accept-btn-handler";
    const button = await page.$(cookiesAcceptButtonId);
    if (button) {
      await button.click();
      console.log("Clicked the accept cookies button");
    } else {
      console.log("Accept cookies button not found, continuing...");
    }

    await page.waitForSelector("article.product");
    const firstArticle = await page.$("article.product");
    const firstLink = await firstArticle?.$("a.product-link");
    await firstLink?.click();
    console.log("Clicked first item link");

    // Find and save product name
    let productName: string | null = null;
    await page.waitForSelector("h1.rd-title");
    const productNameElement = await page.$("h1.rd-title");
    if (productNameElement) {
      productName = await page.evaluate(
        (element) => element?.textContent,
        productNameElement,
      );
      console.log(`Found product name - ${productName}`);
    } else {
      console.log("Product name not found");
    }

    // Find and save product price
    let kauflandPrice: string | null = null;
    await page.waitForSelector("span.rd-price-information__price");
    const priceElement = await page.$("span.rd-price-information__price");
    if (priceElement) {
      kauflandPrice = await page.evaluate(
        (element) => element?.textContent,
        priceElement,
      );
      console.log(`Found Kaufland Price - ${kauflandPrice}`);
    } else {
      console.log("Product price not found");
    }

    // Save the URL
    const kauflandLink = page.url();
    console.log("Kaufland link -", kauflandLink);

    // Close the browser
    await browser.close();

    const productFound = !!productName || !!kauflandPrice;
    if (productFound) {
      const kauflandProductData: KauflandProductData = {
        productFound: productFound,
        productName: productName,
        kauflandPrice: kauflandPrice,
        kauflandLink: kauflandLink,
      };
      console.log("Returned Kaufland Product Data object", kauflandProductData);
      return kauflandProductData;
    } else {
      console.log("Kaufland Product Data not found");
      return {
        productFound: false,
      };
    }
  } catch (error) {
    console.error(
      "Kaufland Product Data not found - An error occurred:",
      error,
    );
    return {
      productFound: false,
    };
  }
}
