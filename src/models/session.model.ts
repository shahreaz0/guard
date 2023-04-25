import { prop, Ref, modelOptions, getModelForClass } from "@typegoose/typegoose"
import { User } from "./user.model"

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
})
export class Session {
  @prop({ ref: () => User })
  user?: Ref<User>

  @prop({ default: true })
  valid?: boolean
}

export default getModelForClass(Session)
