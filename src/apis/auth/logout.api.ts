import { Request, Response } from "express";
import { logoutService } from "@/services/auth.service";

export const logoutAPI = async (
    req: Request,
    res: Response
): Promise<Response> => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(400).json({
        message: "Valid authorization token required",
      });
    }

    const token = header.split(" ")[1];

    await logoutService(token);

    return res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error: unknown) {
    return res.status(500).json({
      message:
          error instanceof Error
              ? error.message
              : "Logout failed",
    });
  }
};