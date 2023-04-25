import express from "express"
const router = express.Router()

import * as authController from "../controllers/auth.controller"

import * as schemas from "../schemas/auth.schema"

import validateResource from "../middlewares/validate-resource"

router.get("/auth", (_, res) => {
  res.send({ message: "auth" })
})

router.post(
  "/login",
  validateResource(schemas.loginSchema),
  authController.loginHandler
)

export default router
