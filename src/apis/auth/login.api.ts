import { Request, Response } from "express";
import { loginController } from "@/controllers/auth.controller";

export const loginAPI = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Identifier and password are required",
      });
    }

    const result = await loginController({
      identifier: identifier.trim(),
      password,
    });

    return res.status(200).json(result);

  } catch (error: any) {
    return res.status(401).json({
      message: error?.message || "Authentication failed",
    });
  }
};