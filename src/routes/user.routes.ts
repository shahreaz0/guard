import express from "express"

const router = express.Router()

router.get("/users", (_, res) => {
  res.send({ message: "users" })
})

export default router
