import chalk from "chalk";
import { Request } from "express";

export const timer = (req: Request, label: string) => {

  const start = Date.now();

  return () => {

    const duration = Date.now() - start;

    console.log(
        chalk.gray(req.requestId),
        chalk.dim("→"),
        chalk.cyan(label),
        chalk.magenta(`${duration} ms`)
    );
  };
};