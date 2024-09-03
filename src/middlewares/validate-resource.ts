import type { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import { type AnyZodObject, ZodError, z } from "zod"
import log from "../utils/logger"
const validateResource =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        log.error(error.message)
        next(createHttpError.BadRequest(error.issues[0].message))
      }
    }
  }

export default validateResource
