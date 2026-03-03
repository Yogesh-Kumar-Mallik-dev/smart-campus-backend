import dotenv from "dotenv";
import mongoose from "mongoose";
import readline from "readline";
import { User, Role, UserStatus } from "@/models/user.model";
import { AuditLog } from "@/models/audit.model";

dotenv.config();

const identifier = process.argv[2];

const deactivateUser = async (): Promise<void> => {
  try {
    if (!identifier) {
      console.log("Provide tempId or memberId");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI as string);

    const user = await User.findOne({
      $or: [
        { tempId: identifier },
        { memberId: identifier },
      ],
    });

    if (!user) {
      console.log("User not found");
      process.exit(1);
    }

    if (user.roles.includes(Role.REGISTRAR)) {
      console.log("Cannot deactivate registrar");
      process.exit(1);
    }

    if (user.status === UserStatus.OFFLINE) {
      console.log("User already inactive");
      process.exit(0);
    }

    /* ---------- Confirmation Prompt ---------- */

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const confirmed = await new Promise<boolean>((resolve) => {
      rl.question(
          `Are you sure you want to deactivate ${user.full_name}? (yes/no): `,
          (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === "yes");
          }
      );
    });

    if (!confirmed) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    /* ---------- Soft Delete ---------- */

    user.status = UserStatus.OFFLINE;
    await user.save();

    /* ---------- Audit Log ---------- */

    await AuditLog.create({
      action: "USER_DEACTIVATED",
      targetUser: user._id,
    });

    console.log("User deactivated successfully");
    process.exit(0);

  } catch (error) {
    console.error("Operation failed:", error);
    process.exit(1);
  }
};

void deactivateUser();