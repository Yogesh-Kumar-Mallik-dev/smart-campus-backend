import { Request, Response } from "express";
import { User } from "@/models/user.model";

export const getUsersAPI = async (
    req: Request,
    res: Response
): Promise<Response> => {
  try {
    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch {
    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};