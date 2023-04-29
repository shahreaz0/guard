import { Request, Response, NextFunction } from "express"

export default function requireUser(
  req: Request,
  res: Response<{}, { user: object }>,
  next: NextFunction
) {
  if (!res.locals.user) return res.status(403).send({ message: "Forbidden" })
  next()
}
