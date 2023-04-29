import { DocumentType } from "@typegoose/typegoose"
import { User } from "../models/user.model"

import { signJwt } from "../utils/jwt"
import SessionModel from "../models/session.model"

function createSession(userId: string) {
  return SessionModel.create({ user: userId })
}

export function signAccessToken(user: DocumentType<User>) {
  const {
    verification_code,
    password_reset_code,
    validatePassword,
    password,
    ...rest
  } = user.toJSON()

  return signJwt(rest, "access", {
    expiresIn: "15m",
  })
}

export async function signRefreshToken({ userId }: { userId: string }) {
  try {
    const oldSession = await SessionModel.findOne({
      user: userId,
    })

    if (!oldSession) {
      const session = await createSession(userId)
      return signJwt({ sessionId: session._id }, "refresh", {
        expiresIn: "30d",
      })
    }

    return signJwt({ sessionId: oldSession._id }, "refresh", {
      expiresIn: "30d",
    })
  } catch (error) {
    return null
  }
}

export function findSessionById(sessionId: string) {
  return SessionModel.findById(sessionId)
}

export function deleteSessionById(sessionId: string) {
  return SessionModel.deleteOne({ _id: sessionId })
}
