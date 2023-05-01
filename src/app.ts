import express, { ErrorRequestHandler } from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import CreateHttpError from "http-errors"
import { z } from "zod"
import helmet from "helmet"
import cors from "cors"
import compression from "compression"

// router
import router from "./routes"

// logger
import log from "./utils/logger"

// db
import connectDb from "./utils/connect"

// middlewares
import deserializeUser from "./middlewares/deserialize-user"

// setup envs
dotenv.config()
const envVars = z.object({
  PORT: z.string(),
  MONGO_URI: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
})

envVars.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVars> {}
  }
}

// express config
const app = express()
app.use(express.json())
app.use(morgan("tiny"))
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(deserializeUser)
app.use("/api/v1", router)

app.disable("x-powered-by")

app.use((_req, _res, next) => {
  next(CreateHttpError.NotFound())
})

app.use(((err, _req, res, next) => {
  res.status(err.status || 500)

  res.send({
    status: err.status || 500,
    message: err.message,
  })
}) as ErrorRequestHandler)

app.listen(process.env.PORT, () => {
  log.info(`http://localhost:${process.env.PORT}`)
  connectDb()
})
