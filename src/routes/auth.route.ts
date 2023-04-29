import express from "express"
const router = express.Router()

import * as authController from "../controllers/auth.controller"

import * as schemas from "../schemas/auth.schema"

import validateResource from "../middlewares/validate-resource"

import requireUser from "../middlewares/require-user"

router.post(
  "/sessions/login",
  validateResource(schemas.loginSchema),
  authController.loginUserHandler
)

router.post("/sessions/refresh", authController.refreshAccessTokenHandler)

router.post("/sessions/logout", requireUser, authController.logoutUserHandler)

export default router
