import type { Request, Response } from "express"
import { CreateUserInput } from "../schemas/user.schema"

export function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body

  res.send(body)
}
