import chalk from "chalk";
import { Request } from "express";

export const trace = (req: Request, step: string) => {

  const id = req.requestId || "REQ-UNKNOWN";

  console.log(
      chalk.gray(id),
      chalk.dim("→"),
      chalk.cyan(step)
  );
};