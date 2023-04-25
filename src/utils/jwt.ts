import { verify } from "crypto"
import jwt, { SignOptions } from "jsonwebtoken"

export function signJwt(
  payload: object,
  tokenType: "access" | "refresh",
  options?: SignOptions
) {
  const secret =
    tokenType === "access"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET

  return jwt.sign(payload, secret, {
    ...(options && options),
  })
}

export function verifyJwt<T extends object>(
  token: string,
  tokenType: "access" | "refresh"
) {
  const secret =
    tokenType === "access"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET

  try {
    return jwt.verify(token, secret) as T
  } catch (error) {
    return null
  }
}
