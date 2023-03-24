import mongoose from "mongoose"
import log from "./logger"

export default async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    log.info("Database connected!!")
  } catch (error) {
    if (error instanceof mongoose.Error) {
      log.error(error.message)
      process.exit(1)
    }
  }
}
