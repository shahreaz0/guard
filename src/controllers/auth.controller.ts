import { Request, Response } from "express"
import type { LoginInput } from "../schemas/auth.schema"
import { findUserByEmail } from "../services/user.service"
import { signAccessToken, signRefreshToken } from "../services/auth.service"

export async function loginHandler(
  req: Request<{}, {}, LoginInput>,
  res: Response
) {
  const message = "Invalid username or password"

  const user = await findUserByEmail(req.body.email)

  if (!user) return res.status(400).send({ message })

  if (!user.verified)
    res.status(400).send({ message: "Please verifiy your account" })

  const validPassword = await user.validatePassword(req.body.password)

  if (!validPassword) return res.status(400).send({ message })

  const accessToken = signAccessToken(user)

  const refreshToken = await signRefreshToken({ userId: user.id })

  if (!refreshToken) return res.send({ message: "Please try again" })

  res.send({ access_token: accessToken, refresh_token: refreshToken })
}
