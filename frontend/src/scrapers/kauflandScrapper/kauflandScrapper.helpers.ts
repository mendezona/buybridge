export function extractKauflandProductId(
  url: string,
): string | null | undefined {
  const regex = /\/product\/(\d+)\//;
  const match = url.match(regex);
  return match ? match[1] : null;
}
