import { Schema, model, Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  targetUser: Types.ObjectId;
  performedAt: Date;
}

const auditSchema = new Schema<IAuditLog>({
  action: {
    type: String,
    required: true,
  },
  targetUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  performedAt: {
    type: Date,
    default: Date.now,
  },
});

export const AuditLog = model<IAuditLog>("AuditLog", auditSchema);