import pino from "pino"

const log = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
})

export default log
