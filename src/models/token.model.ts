import { Schema, model, Document, Types } from "mongoose";

export interface IToken {
  user: Types.ObjectId;
  token: string;
}

export interface ITokenDocument extends IToken, Document {}

const tokenSchema = new Schema<ITokenDocument>(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      token: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export const Token = model<ITokenDocument>("Token", tokenSchema);