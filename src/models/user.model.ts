import { Schema, model, HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";

/* ================= ENUMS ================= */

export enum Role {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
  MESS = "MESS",
  REGISTRAR = "REGISTRAR",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  OFFLINE = "OFFLINE",
}

/* ================= INTERFACE ================= */

export interface IUser {
  full_name: string;
  academic_name: string;
  email: string;

  roles: Role[];

  memberId?: string | null;
  tempId: string;

  password: string;

  status: UserStatus;

  /* optional academic data for notifications */
  batch?: string;
  class?: string;

  /* dynamic attributes */
  attributes?: Record<string, any>;
}

/* ================= DOCUMENT TYPE ================= */

export type IUserDocument = HydratedDocument<IUser> & {
  comparePassword(password: string): Promise<boolean>;
};

/* ================= SCHEMA ================= */

const userSchema = new Schema<IUserDocument>(
    {
      full_name: { type: String, required: true, trim: true },

      academic_name: { type: String, required: true, trim: true },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
      },

      roles: {
        type: [String],
        enum: Object.values(Role),
        required: true,
      },

      memberId: {
        type: String,
        default: null,
        unique: true,
        sparse: true,
        index: true,
      },

      tempId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      password: {
        type: String,
        required: true,
        select: false,
      },

      status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE,
      },

      /* academic targeting */

      batch: {
        type: String,
        default: null,
        index: true,
      },

      class: {
        type: String,
        default: null,
        index: true,
      },

      /* attribute based targeting */

      attributes: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },
    { timestamps: true }
);

/* ================= PASSWORD HASH ================= */

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* ================= PASSWORD COMPARE ================= */

userSchema.methods.comparePassword = async function (
    candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

/* ================= MODEL ================= */

export const User = model<IUserDocument>("User", userSchema);