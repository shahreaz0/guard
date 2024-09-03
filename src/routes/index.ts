import express from "express"
const router = express.Router()

import auth from "./auth.route"
import user from "./user.route"

router.get("/healthcheck", (_, res) => {
  res.send({ message: "OK" })
})

router.use(user)
router.use(auth)

export default router
