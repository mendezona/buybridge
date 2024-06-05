import { type Page } from "puppeteer-core";

export const detectAndConvertPrice = (price: string): string => {
  const cleanedPrice = price.replace(/[^\d.,]/g, "");

  if (cleanedPrice.includes(".") && cleanedPrice.includes(",")) {
    const lastDotIndex = cleanedPrice.lastIndexOf(".");
    const lastCommaIndex = cleanedPrice.lastIndexOf(",");

    if (lastCommaIndex > lastDotIndex) {
      return cleanedPrice.replace(/\./g, "").replace(",", ".");
    } else {
      return cleanedPrice.replace(/,/g, "");
    }
  }

  if (cleanedPrice.includes(",")) {
    return cleanedPrice.replace(/\./g, "").replace(",", ".");
  }

  if (cleanedPrice.includes(".")) {
    return cleanedPrice.replace(/,/g, "");
  }

  return cleanedPrice;
};

export const waitForJavascriptToLoad = async (
  page: Page,
  checkFn: () => boolean,
  timeout = 5000,
): Promise<void> => {
  console.log("Waiting for Javascript to load");
  const interval = 100;
  const maxAttempts = Math.floor(timeout / interval);
  let attempts = 0;

  while (attempts < maxAttempts) {
    const isLoaded = await page.evaluate(checkFn);
    if (isLoaded) {
      console.log("Javascript finished loading");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
    attempts++;
  }
  throw new Error("Timeout waiting for Javascript to load");
};

export function formatToTwoDecimalPlaces(num: number): string {
  return num.toFixed(2);
}
