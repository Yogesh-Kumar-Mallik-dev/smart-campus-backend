import { Request, Response } from "express";
import { User, Role, UserStatus } from "@/models/user.model";

export const deactivateUserAPI = async (
    req: Request,
    res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.roles.includes(Role.REGISTRAR)) {
      return res.status(403).json({
        message: "Cannot deactivate registrar",
      });
    }

    user.status = UserStatus.OFFLINE;

    await user.save();

    return res.status(200).json({
      message: "User deactivated",
    });
  } catch {
    return res.status(400).json({
      message: "User deactivation failed",
    });
  }
};