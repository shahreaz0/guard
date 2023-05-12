import { verify } from "crypto"
import jwt, { SignOptions } from "jsonwebtoken"
import createHttpError, { CreateHttpError } from "http-errors"

export function signJwt(
  payload: object,
  tokenType: "access" | "refresh",
  options?: SignOptions
) {
  return new Promise((resolve, reject) => {
    const secret =
      tokenType === "access"
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET

    const jwtOptions = {
      ...(options && options),
    }

    jwt.sign(payload, secret, jwtOptions, (error, token) => {
      if (error) reject(createHttpError.InternalServerError())

      resolve(token)
    })
  })
}

export function verifyJwt<T extends object>(
  token: string,
  tokenType: "access" | "refresh"
): Promise<T> {
  return new Promise((resolve, reject) => {
    const secret =
      tokenType === "access"
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET

    jwt.verify(token, secret, (error, decoded) => {
      if (error) reject(createHttpError.InternalServerError())

      resolve(decoded as T)
    })
  })
}
