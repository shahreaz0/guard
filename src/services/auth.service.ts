import { UserDocument } from "../models/user.model"

import { signJwt } from "../utils/jwt"
import SessionModel from "../models/session.model"

export function createSession(userId: string) {
  return SessionModel.create({ user: userId })
}

export function findSessionById(sessionId: string) {
  return SessionModel.findById(sessionId)
}

export function deleteSessionById(sessionId: string) {
  return SessionModel.deleteOne({ _id: sessionId })
}

export async function signAccessToken(user: UserDocument) {
  const { verification_code, password_reset_code, password, ...rest } =
    user.toJSON()

  try {
    const token = await signJwt(rest, "access", {
      expiresIn: "15m",
    })

    return token
  } catch (error) {
    throw error
  }
}

export async function signRefreshToken({ userId }: { userId: string }) {
  try {
    const oldSession = await SessionModel.findOne({
      user: userId,
    })

    if (!oldSession) {
      const session = await createSession(userId)
      const token = await signJwt({ sessionId: session._id }, "refresh", {
        expiresIn: "30d",
      })

      return token
    }

    const token = await signJwt({ sessionId: oldSession._id }, "refresh", {
      expiresIn: "30d",
    })

    return token
  } catch (error) {
    return null
  }
}
