import nodemailer, { SendMailOptions } from "nodemailer"
import log from "./logger"

async function createTestAccount() {
  const testAcc = await nodemailer.createTestAccount()
  console.log(testAcc)
}

const smtp = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "o4rk2oenchmffoqf@ethereal.email",
    pass: "jTy3ySv8MQfvbU2hAW",
  },
}

const transporter = nodemailer.createTransport(smtp)

export async function sendEmail(payload: SendMailOptions) {
  try {
    let info = await transporter.sendMail(payload)
    log.info(info.messageId)
    log.info(nodemailer.getTestMessageUrl(info))
  } catch (error) {
    log.error(error)
  }
}
