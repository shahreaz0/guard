import { z } from "zod"

export const createUserSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Email must be valid"),
      first_name: z.string({ required_error: "First name is required" }),
      last_name: z.string({ required_error: "Last name is required" }),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password is too short - should be min 6 chars"),

      confirmPassword: z.string({
        required_error: "Password confirmation is required",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password must be match",
      path: ["confirmPassword"],
    }),
})

export type CreateUserInput = z.TypeOf<typeof createUserSchema>["body"]
