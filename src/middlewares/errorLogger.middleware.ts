import { Request, Response, NextFunction } from "express";
import chalk from "chalk";

export const errorLogger = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

  console.error(
      chalk.red("ERROR"),
      chalk.gray(req.requestId),
      chalk.red(err.message),
      "\n",
      chalk.gray(err.stack)
  );

  next(err);
};