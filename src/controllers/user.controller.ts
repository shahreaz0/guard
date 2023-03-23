import type { Request, Response } from "express"
import { CreateUserInput } from "../schemas/user.schema"
import logger from "../utils/logger"
import { createUser } from "../services/user.service"

import { sendEmail } from "../utils/mailer"

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  try {
    const user = await createUser(req.body)

    await sendEmail({
      from: "ashahreaz@gmail.com",
      to: user.email,
      subject: "Verify your account",
      text: `Verification code: ${user.verification_code} | User ID: ${user.email}`,
    })

    res.send({
      message: "success",
      data: user,
    })
  } catch (error: any) {
    logger.warn(error)

    if (error.code === 11000)
      return res.status(409).send({ message: "Account already exists" })

    res.status(500).send(error.message)
  }
}
