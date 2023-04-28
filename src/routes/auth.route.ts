import express from "express"
const router = express.Router()

import * as authController from "../controllers/auth.controller"

import * as schemas from "../schemas/auth.schema"

import validateResource from "../middlewares/validate-resource"

router.post(
  "/sessions/login",
  validateResource(schemas.loginSchema),
  authController.loginHandler
)

router.post("/sessions/refresh", authController.refreshAccessTokenHandler)

export default router
