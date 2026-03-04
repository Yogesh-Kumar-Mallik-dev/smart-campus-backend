import { Request, Response } from "express";
import { updateUserController } from "@/controllers/user.controller";

export const updateUserAPI = async (
    req: Request,
    res: Response
): Promise<Response> => {

  try {

    const { id } = req.params;

    const result = await updateUserController({
      requesterId: req.user._id.toString(),
      requesterRoles: req.user.roles,
      targetUserId: id,
      ...req.body,
    });

    return res.status(200).json(result);

  } catch (error: unknown) {

    return res.status(400).json({
      message:
          error instanceof Error
              ? error.message
              : "User update failed",
    });

  }
};