import { z } from "zod"

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Inalid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Inalid email or password"),
  }),
})

export type LoginInput = z.infer<typeof loginSchema>["body"]
