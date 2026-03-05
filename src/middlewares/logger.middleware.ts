import morgan from "morgan";
import chalk from "chalk";
import { Request } from "express";

const statusColor = (status: number): string => {
  if (status >= 500) return chalk.red(status.toString());
  if (status >= 400) return chalk.yellow(status.toString());
  if (status >= 300) return chalk.cyan(status.toString());
  if (status >= 200) return chalk.green(status.toString());
  return status.toString();
};

const methodColor = (method: string): string => {
  switch (method) {
    case "GET":
      return chalk.green(method);
    case "POST":
      return chalk.blue(method);
    case "PUT":
      return chalk.yellow(method);
    case "PATCH":
      return chalk.magenta(method);
    case "DELETE":
      return chalk.red(method);
    default:
      return chalk.white(method);
  }
};

morgan.token("request-id", (req: Request) => req.requestId || "REQ-UNKNOWN");

morgan.token("user-temp", (req: any) => {
  return req.user?.tempId || "ANON";
});

morgan.token("colored-status", (_req, res) => {
  return statusColor(res.statusCode);
});

export const logger = morgan((tokens, req, res) => {

  const env = chalk.gray(`[${process.env.NODE_ENV || "development"}]`);

  const requestId = chalk.gray(tokens["request-id"](req, res));

  const user = chalk.cyan(tokens["user-temp"](req, res));

  const method = methodColor(tokens.method(req, res) || "");

  const url = chalk.white(tokens.url(req, res));

  const status = tokens["colored-status"](req, res);

  const time = chalk.magenta(tokens["response-time"](req, res) + " ms");

  return `${env} ${requestId} ${user} ${method} ${url} ${status} ${time}`;
});