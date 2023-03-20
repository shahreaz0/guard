import express from "express"
import dotenv from "dotenv"
import logger from "./utils/logger"
import morgan from "morgan"

dotenv.config()

// express config
const app = express()
app.use(morgan("tiny"))

app.get("/", (req, res) => {
  res.send({ message: "OK" })
})

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  logger.info(`http://localhost:${process.env.PORT}`)
})
