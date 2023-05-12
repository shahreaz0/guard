import { NextFunction, Request, Response } from "express"
import type { LoginInput } from "../schemas/auth.schema"
import { findUserByEmail, findUserById } from "../services/user.service"

import createHttpError from "http-errors"

import {
  signAccessToken,
  signRefreshToken,
  findSessionById,
  deleteSessionById,
} from "../services/auth.service"
import { verifyJwt } from "../utils/jwt"

export async function loginUserHandler(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const message = "Invalid username or password"

    const user = await findUserByEmail(req.body.email)

    if (!user) throw createHttpError.BadRequest(message)

    if (!user.verified)
      throw createHttpError.BadRequest("Please verifiy your account")

    const validPassword = await user.validatePassword(req.body.password)

    if (!validPassword) throw createHttpError.BadRequest(message)

    const accessToken = await signAccessToken(user)

    const refreshToken = await signRefreshToken({ userId: user.id })

    if (!refreshToken) return res.send({ message: "Please try again" })

    res.send({ access_token: accessToken, refresh_token: refreshToken })
  } catch (error) {
    next(error)
  }
}

export async function refreshAccessTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["x-refresh"] as string

    if (!token) throw createHttpError.BadRequest("Provide token")

    const decoded = await verifyJwt<{ sessionId: string }>(token, "refresh")

    if (!decoded) throw createHttpError.Unauthorized("Could not generate token")

    const session = await findSessionById(decoded.sessionId)

    if (!session || !session.valid)
      throw createHttpError.Unauthorized("Could not generate token")

    const user = await findUserById(String(session.user))

    if (!user) throw createHttpError.Unauthorized("Could not generate token")

    const accessToken = await signAccessToken(user)

    res.send({ access_token: accessToken })
  } catch (error) {
    next(error)
  }
}

export async function logoutUserHandler(
  req: Request,
  res: Response<{}, { user: { first_name: string } }>,
  next: NextFunction
) {
  try {
    const token = req.headers["x-refresh"] as string

    if (!token) throw createHttpError.BadRequest("Provide token")

    const decoded = await verifyJwt<{ sessionId: string }>(token, "refresh")

    if (!decoded) throw createHttpError.Unauthorized("Could not logout")

    await deleteSessionById(decoded.sessionId)

    res.send({ message: "Logged out " + res.locals.user.first_name })
  } catch (error) {
    next(error)
  }
}
