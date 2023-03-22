import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  pre,
  DocumentType,
} from "@typegoose/typegoose"
import crypto from "node:crypto"
import * as argon2 from "argon2"

import logger from "../utils/logger"

@pre<User>("save", async function () {
  if (!this.isModified("password")) return

  this.password = await argon2.hash(this.password as string)
  return
})
@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, trim: true, unique: true, required: true })
  email?: string

  @prop({ required: true })
  first_name?: string

  @prop({ required: true })
  last_name?: string

  @prop({ required: true })
  password?: string

  @prop({ default: crypto.randomBytes(6).toString("base64").toUpperCase() })
  verification_code?: string

  @prop()
  password_reset_code?: string | null

  @prop({ default: false })
  verified?: boolean

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password as string, candidatePassword)
    } catch (error) {
      logger.error(error instanceof Error && error.message)
      return false
    }
  }
}

const UserModel = getModelForClass(User)

export default UserModel
