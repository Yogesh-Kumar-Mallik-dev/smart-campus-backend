import dotenv from "dotenv";
import mongoose from "mongoose";
import { User, Role } from "@/models/user.model";

dotenv.config();

const identifier = process.argv[2];

const deleteUser = async () => {
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
      console.log("Cannot delete registrar");
      process.exit(1);
    }

    await user.deleteOne();

    console.log("User deleted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Deletion failed:", error);
    process.exit(1);
  }
};

void deleteUser();