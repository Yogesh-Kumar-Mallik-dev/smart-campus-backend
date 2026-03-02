import { Request, Response } from "express";
import { loginService } from "@/services/auth.service";

export const loginAPI = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body as {
      identifier?: string;
      password?: string;
    };

    // Basic validation
    if (!identifier || !password) {
      return res.status(400).json({
        message: "Identifier and password are required",
      });
    }

    const { user, token } = await loginService(
        identifier.trim(),
        password
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id, // cleaner than _id
        name: user.name,
        roles: user.roles,
      },
    });

  } catch (error: any) {
    return res.status(401).json({
      message: error?.message || "Authentication failed",
    });
  }
};