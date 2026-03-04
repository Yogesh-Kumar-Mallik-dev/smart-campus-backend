import { Schema, model } from "mongoose";

export type Operator = "<" | ">" | "<=" | ">=" | "==" | "!=";

interface AttributeCondition {
  key: string;
  operator: Operator;
  value: any;
}

const AttributeConditionSchema = new Schema<AttributeCondition>(
    {
      key: { type: String, required: true },
      operator: {
        type: String,
        enum: ["<", ">", "<=", ">=", "==", "!="],
        required: true,
      },
      value: { type: Schema.Types.Mixed, required: true },
    },
    { _id: false }
);

const NotificationSchema = new Schema(
    {
      title: { type: String, required: true },
      message: { type: String, required: true },

      targetUserId: { type: Schema.Types.ObjectId, ref: "User" },
      targetRole: { type: String },

      targetBatch: { type: String },
      targetClass: { type: String },

      targetAttributes: [AttributeConditionSchema],

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
);

export const Notification = model("Notification", NotificationSchema);