import express from "express"

const router = express.Router()

router.get("/auth", (_, res) => {
  res.send({ message: "auth" })
})

export default router
