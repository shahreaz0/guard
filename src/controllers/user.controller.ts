import type { Request, Response } from "express"
import { CreateUserInput } from "../schemas/user.schema"
import logger from "../utils/logger"
import mongoose from "mongoose"
import { createUser } from "../services/user.service"
import { number } from "zod"

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  try {
    const user = await createUser(req.body)

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
