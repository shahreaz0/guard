import { z, AnyZodObject, ZodError } from "zod"
import type { Request, Response, NextFunction } from "express"
import logger from "../utils/logger"
const validateResource =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(error.message)
        res.status(400).send({ message: error.issues[0].message })
      }
    }
  }

export default validateResource
