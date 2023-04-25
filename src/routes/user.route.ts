import express from "express"
const router = express.Router()
import * as userController from "../controllers/user.controller"
import validateResource from "../middlewares/validate-resource"
import * as schemas from "../schemas/user.schema"

router.post(
  "/users",
  validateResource(schemas.createUserSchema),
  userController.createUserHandler
)

router.post(
  "/users/verify",
  validateResource(schemas.verifyUserSchema),
  userController.verifyUserHandler
)

router.post(
  "/users/forgotpassword",
  validateResource(schemas.forgotPasswordSchema),
  userController.forgotPasswordHandler
)

router.post(
  "/users/resetpassword/:id/:reset_password_code",
  validateResource(schemas.resetPasswordSchema),
  userController.resetPasswordHandler
)

export default router
