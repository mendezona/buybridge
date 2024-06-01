import puppeteer from "puppeteer-core";
import { waitForJavascriptToLoad } from "../scrapper.helpers";
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

    await waitForJavascriptToLoad(page, () => {
      return document.querySelector("article.product .product-link") !== null;
    });
    await page.waitForSelector("article.product");
    const firstArticle = await page.$("article.product");

    let productName = undefined;
    let kauflandPrice = undefined;
    let kauflandLink = undefined;

    if (firstArticle) {
      const firstArticleHTML = await page.evaluate(
        (element) => element.outerHTML,
        firstArticle,
      );
      console.log("First article HTML:", firstArticleHTML);

      // Extract product name
      try {
        await firstArticle.waitForSelector("div.product__title");
        productName = await firstArticle.$eval("div.product__title", (el) =>
          el.textContent?.trim(),
        );
        if (productName) {
          console.log(`Found product name - ${productName}`);
        } else {
          console.log("Product name not found");
        }
      } catch (error) {
        console.log("Error finding product name:", error);
      }

      // Extract Kaufland price
      try {
        await firstArticle.waitForSelector("div.price");
        kauflandPrice = await firstArticle.$eval("div.price", (el) =>
          el.textContent?.trim(),
        );
        if (kauflandPrice) {
          console.log(`Found Kaufland Price - ${kauflandPrice}`);
        } else {
          console.log("Product price not found");
        }
      } catch (error) {
        console.log("Error finding product price:", error);
      }

      // Extract Kaufland link
      try {
        await firstArticle.waitForSelector("a.product-link", { timeout: 5000 });
        try {
          await firstArticle.waitForSelector("a.product-link", {
            timeout: 5000,
          });
        } catch {
          console.log(
            "Initial wait for product link failed, waiting longer...",
          );
          await firstArticle.waitForSelector("a.product-link", {
            timeout: 20000,
          });
        }
        kauflandLink = await firstArticle.$eval(
          "a.product-link",
          (el) => `https://kaufland.de${el.getAttribute("href")}`,
        );
        if (kauflandLink) {
          console.log(`Found Kaufland link - ${kauflandLink}`);
        } else {
          console.log("Kaufland link not found");
        }
      } catch (error) {
        console.log("Error finding Kaufland link:", error);
      }
    } else {
      console.log('No article found with the class "product".');
    }

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
