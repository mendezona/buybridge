import crypto from "crypto";

export function kauflandSellerApiSignRequest(
  method: string,
  uri: string,
  body: string,
  timestamp: number,
  secretKey: string,
): string {
  const stringToSign = [method, uri, body, timestamp].join("\n");
  return crypto
    .createHmac("sha256", secretKey)
    .update(stringToSign)
    .digest("hex");
}
