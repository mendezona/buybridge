import crypto from "crypto";
import { type KauflandSellerApiSignRequestParams } from "./kauflandSellerApi.types";

export function kauflandSellerApiSignRequest({
  method,
  uri,
  body,
  timestamp,
  secretKey,
}: KauflandSellerApiSignRequestParams): string {
  const stringToSign = [method, uri, body, timestamp].join("\n");
  return crypto
    .createHmac("sha256", secretKey)
    .update(stringToSign)
    .digest("hex");
}
