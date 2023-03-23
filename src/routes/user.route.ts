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

export default router
