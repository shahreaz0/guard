import express from "express"
const router = express.Router()

import user from "./user.route"
import auth from "./auth.route"

router.get("/healthcheck", (_, res) => {
  res.send({ message: "OK" })
})

router.use(user)
router.use(auth)

export default router
