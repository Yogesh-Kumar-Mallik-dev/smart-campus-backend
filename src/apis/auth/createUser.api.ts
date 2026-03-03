import { Request, Response } from "express";
import { createUserController } from "@/controllers/user.controller";

export const createUserAPI = async (
    req: Request,
    res: Response
): Promise<Response> => {
  try {
    const result = await createUserController(req.body);

    return res.status(201).json(result);

  } catch (error: unknown) {
    return res.status(400).json({
      message:
          error instanceof Error
              ? error.message
              : "User creation failed",
    });
  }
};