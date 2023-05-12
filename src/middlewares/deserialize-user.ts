import { Request, Response, NextFunction } from "express"
import { verifyJwt } from "../utils/jwt"

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = (req.headers.authorization || "").split(" ")[1]

    if (!token) return next()

    const decoded = await verifyJwt(token, "access")

    res.locals.user = decoded

    return next()
  } catch (error) {
    next(error)
  }
}
