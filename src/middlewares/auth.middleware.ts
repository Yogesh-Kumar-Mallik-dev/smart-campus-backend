import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import { Token } from "@/models/token.model";

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
    ) as { id: string };

    const stored = await Token.findOne({ token });
    if (!stored) {
      return res.status(401).json({ message: "Session expired" });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};