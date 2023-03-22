import express from "express"
const router = express.Router()
import * as userController from "../controllers/user.controller"
import validateResource from "../middlewares/validate-resource"
import { createUserSchema } from "../schemas/user.schema"

router.post(
  "/users",
  validateResource(createUserSchema),
  userController.createUserHandler
)

export default router
