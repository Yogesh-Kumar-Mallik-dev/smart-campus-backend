import { Request, Response } from "express";
import { updateUserController } from "@/controllers/user.controller";

export const updateUserAPI = async (
    req: Request,
    res: Response
): Promise<Response> => {
  try {
    const result = await updateUserController({
      targetUserId: req.params.id,
      ...req.body,
    });

    return res.status(200).json(result);

  } catch (error: unknown) {
    return res.status(400).json({
      message:
          error instanceof Error
              ? error.message
              : "Update failed",
    });
  }
};