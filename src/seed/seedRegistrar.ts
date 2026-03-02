import dotenv from "dotenv";
import mongoose from "mongoose";
import { User, Role } from "@/models/user.model";
import { generateTempId } from "@/services/user.service";

dotenv.config();

const seedRegistrar = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const existing = await User.findOne({
      roles: Role.REGISTRAR,
    });

    if (existing) {
      console.log("Registrar already exists.");
      process.exit(0);
    }

    const roles = [Role.REGISTRAR];

    const tempId = await generateTempId(roles);

    await User.create({
      name: "Temporary Registrar",
      email: "registrar@smartcampus.local",
      roles,
      tempId,
      password: tempId,
      // memberId intentionally NOT set
    });

    console.log("Registrar created successfully.");
    console.log("Login Identifier:", tempId);
    console.log("Password:", tempId);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

void seedRegistrar();