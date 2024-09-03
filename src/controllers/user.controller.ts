import type { Request, Response } from "express"
import type {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schemas/user.schema"
import * as services from "../services/user.service"
import log from "../utils/logger"

import { sendEmail } from "../utils/mailer"

import mongoose from "mongoose"
import { User } from "../models/user.model"
import { generateRandomCode } from "../utils/helpers"

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
  try {
    const user = await services.createUser(req.body)

    await sendEmail({
      from: "ashahreaz@gmail.com",
      to: user.email,
      subject: "Verify your account",
      text: `Verification code: ${user.verification_code} | User ID: ${user._id}`,
    })

    res.send({
      message: "Please check your email and verify your account",
    })
  } catch (error) {
    log.warn(error)

    if (error instanceof mongoose.Error) {
      // @ts-ignore
      if (error.code === 11000) return res.status(409).send({ message: "Account already exists" })

      res.status(500).send(error.message)
    }
  }
}

export async function verifyUserHandler(req: Request<{}, {}, VerifyUserInput>, res: Response) {
  try {
    const user = await services.findUserById(req.body.id)

    if (!user) return res.status(400).send({ message: "No account found" })

    if (user.verified) return res.send({ message: "Already verified" })

    if (req.body.verification_code === user.verification_code) {
      user.verified = true
      await user.save()

      return res.send({ message: "User verified" })
    }

    res.send({ message: "Could not verify user" })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message })
    }
  }
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
) {
  try {
    const user = await services.findUserByEmail(req.body.email)

    if (!user) {
      return res.status(400).send({ message: "Try again" })
    }

    if (!user.verified) return res.status(400).send({ message: "User is not verified" })

    user.password_reset_code = generateRandomCode()

    await user.save()

    await sendEmail({
      from: "shahreaz@gmail.com",
      to: req.body.email,
      subject: "Reset your password",
      text: `Password reset code: ${user.password_reset_code} | userId: ${user._id}`,
    })

    res.send({ message: "Check your mail" })
  } catch (error) {
    //
    log.error(error)
    if (error instanceof Error) {
      res.status(500).send({ message: error.message })
    }
  }
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response,
) {
  const user = await services.findUserById(req.params.id)

  if (
    !user ||
    !user.password_reset_code ||
    req.params.reset_password_code !== user.password_reset_code
  ) {
    return res.status(400).send({ message: "Could not reset password" })
  }

  user.password_reset_code = null

  user.password = req.body.password

  await user.save()

  res.send({ message: "Successfully updated password" })
}

export function getCurrentUserHandler(
  req: Request,
  res: Response<Record<string, never>, { user: Record<string, never> }>,
) {
  res.send(res.locals.user)
}
