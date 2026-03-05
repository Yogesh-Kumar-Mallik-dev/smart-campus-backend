import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export const requestIdMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {

  // noinspection UnnecessaryLocalVariableJS
  const id = `REQ-${uuidv4().slice(0, 8)}`;

  req.requestId = id;

  next();
};