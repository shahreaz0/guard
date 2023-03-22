import mongoose from "mongoose"
import logger from "./logger"

export default async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    logger.info("Database connected!!")
  } catch (error) {
    if (error instanceof mongoose.Error) {
      logger.error(error.message)
      process.exit(1)
    }
  }
}
