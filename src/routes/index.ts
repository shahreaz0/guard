import express from "express"
const router = express.Router()

import user from "./user.routes"
import auth from "./auth.routes"

router.get("/healthcheck", (_, res) => {
  res.send({ message: "OK" })
})

router.use(user)
router.use(auth)

export default router
