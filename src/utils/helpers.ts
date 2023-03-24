import crypto from "node:crypto"

export function generateRandomCode() {
  return crypto.randomBytes(8).toString("base64").toUpperCase()
}
