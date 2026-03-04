import { Schema, model } from "mongoose";

const AnnouncementSchema = new Schema(
    {
      title: { type: String, required: true },
      content: { type: String, required: true },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      expiresAt: Date,
    },
    { timestamps: true }
);

export const Announcement = model("Announcement", AnnouncementSchema);