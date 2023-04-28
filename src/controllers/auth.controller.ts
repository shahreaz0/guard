import { Request, Response } from "express"
import type { LoginInput } from "../schemas/auth.schema"
import { findUserByEmail, findUserById } from "../services/user.service"
import {
  signAccessToken,
  signRefreshToken,
  findSessionById,
} from "../services/auth.service"
import { signJwt, verifyJwt } from "../utils/jwt"

export async function loginHandler(
  req: Request<{}, {}, LoginInput>,
  res: Response
) {
  const message = "Invalid username or password"

  const user = await findUserByEmail(req.body.email)

  if (!user) return res.status(400).send({ message })

  if (!user.verified)
    return res.status(400).send({ message: "Please verifiy your account" })

  const validPassword = await user.validatePassword(req.body.password)

  if (!validPassword) return res.status(400).send({ message })

  const accessToken = signAccessToken(user)

  const refreshToken = await signRefreshToken({ userId: user.id })

  if (!refreshToken) return res.send({ message: "Please try again" })

  res.send({ access_token: accessToken, refresh_token: refreshToken })
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const token = req.headers["x-refresh"] as string

  if (!token) return res.status(401).send({ message: "Provide token" })

  const decoded = verifyJwt<{ sessionId: string }>(token, "refresh")

  if (!decoded)
    return res.status(401).send({ message: "Could not generate token" })

  const session = await findSessionById(decoded.sessionId)

  if (!session || !session.valid)
    return res.status(401).send({ message: "Could not generate token" })

  const user = await findUserById(String(session.user))

  if (!user)
    return res.status(401).send({ message: "Could not generate token" })

  const accessToken = signAccessToken(user)

  res.send({ access_token: accessToken })
}
