import { Request, Response, NextFunction } from "express"
import { verifyJwt } from "../utils/jwt"

export default function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = (req.headers.authorization || "").split(" ")[1]

  if (!token) return next()

  const decoded = verifyJwt(token, "access")

  res.locals.user = decoded

  return next()
}
