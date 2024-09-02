import nodemailer, { type SendMailOptions } from "nodemailer"
import log from "./logger"

async function createTestAccount() {
  const testAcc = await nodemailer.createTestAccount()
  console.log(testAcc)
}

// createTestAccount()

const smtp = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "l7lnsz7iygjdmejr@ethereal.email",
    pass: "a9E2tB9ZXDXxyQdSVY",
  },
}

const transporter = nodemailer.createTransport(smtp)

export async function sendEmail(payload: SendMailOptions) {
  try {
    const info = await transporter.sendMail(payload)
    log.info(info.messageId)
    log.info(nodemailer.getTestMessageUrl(info))
  } catch (error) {
    log.error(error)
  }
}
