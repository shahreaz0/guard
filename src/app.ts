import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import router from "./routes"
import log from "./utils/logger"
import connectDb from "./utils/connect"
import { z } from "zod"

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
app.use("/api/v1", router)

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  log.info(`http://localhost:${process.env.PORT}`)
  connectDb()
})
