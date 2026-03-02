import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, Role } from "@/models/user.model";
import { Token } from "@/models/token.model";
import { generateTempId } from "@/services/user.service";

/* ================= CREATE USER ================= */

export const createUser = async (req: any, res: Response) => {
  const { name, email, roles, memberId } = req.body;

  if (!roles || roles.length === 0) {
    return res.status(400).json({ message: "At least one role required" });
  }

  const tempId = await generateTempId(roles as Role[]);

  const user = await User.create({
    name,
    email,
    roles,
    memberId: memberId || null,
    tempId,
    password: tempId,
  });

  res.status(201).json({
    message: "User created",
    tempId,
  });
};

/* ================= LOGIN ================= */

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (user.status !== "ACTIVE") {
    return res.status(403).json({ message: "User inactive" });
  }

  // single session system
  await Token.deleteMany({ user: user._id });

  const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string
  );

  await Token.create({
    user: user._id,
    token,
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  });
};

/* ================= LOGOUT ================= */

export const logout = async (req: any, res: Response) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(400).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  await Token.deleteOne({ token });

  res.json({ message: "Logged out successfully" });
};