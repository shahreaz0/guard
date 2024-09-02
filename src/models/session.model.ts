import { InferSchemaType, Schema, model } from "mongoose"

const sessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    valid: {
      type: Boolean,
      default: true,
    },
  },
  {
    methods: {},
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
)

export type Session = InferSchemaType<typeof sessionSchema>

const SessionModel = model("Session", sessionSchema)
export default SessionModel
