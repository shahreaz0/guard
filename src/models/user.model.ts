import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose"
import * as argon2 from "argon2"

import { generateRandomCode } from "../utils/helpers"

import log from "../utils/logger"

const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    avatar: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, default: generateRandomCode() },
    verification_code: { type: String, required: true },
    password_reset_code: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  {
    methods: {
      async validatePassword(candidatePassword: string) {
        try {
          const valid = await argon2.verify(
            this.password as string,
            candidatePassword
          )

          return valid
        } catch (error) {
          log.error(error instanceof Error && error.message)
          return false
        }
      },
    },
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return

  this.password = await argon2.hash(this.password as string)
  return
})

export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>

const UserModel = model("User", userSchema)

export default UserModel
