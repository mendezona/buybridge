export const detectAndConvertPrice = (price: string) => {
  const cleanedPrice = price.replace(/[^\d.,]/g, "");

  if (cleanedPrice.includes(".") && cleanedPrice.includes(",")) {
    const lastDotIndex = cleanedPrice.lastIndexOf(".");
    const lastCommaIndex = cleanedPrice.lastIndexOf(",");

    if (lastCommaIndex > lastDotIndex) {
      return parseFloat(cleanedPrice.replace(/\./g, "").replace(",", "."));
    } else {
      return parseFloat(cleanedPrice.replace(/,/g, ""));
    }
  }

  if (cleanedPrice.includes(",")) {
    return parseFloat(cleanedPrice.replace(/\./g, "").replace(",", "."));
  }

  if (cleanedPrice.includes(".")) {
    return parseFloat(cleanedPrice.replace(/,/g, ""));
  }

  return parseFloat(cleanedPrice);
};
