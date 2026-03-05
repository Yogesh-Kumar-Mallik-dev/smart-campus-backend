import chalk from "chalk";

export const traceController = (req: any, name: string) => {
  const id = req.requestId || "REQ-UNKNOWN";

  console.log(
      chalk.gray(id),
      chalk.dim("→"),
      chalk.blue("CONTROLLER"),
      chalk.white(name)
  );
};

export const traceService = (req: any, name: string) => {
  const id = req.requestId || "REQ-UNKNOWN";

  console.log(
      chalk.gray(id),
      chalk.dim("→"),
      chalk.magenta("SERVICE"),
      chalk.white(name)
  );
};

export const traceDatabase = (req: any, operation: string) => {
  const id = req.requestId || "REQ-UNKNOWN";

  console.log(
      chalk.gray(id),
      chalk.dim("→"),
      chalk.yellow("DATABASE"),
      chalk.white(operation)
  );
};

export const traceResponse = (req: any) => {
  const id = req.requestId || "REQ-UNKNOWN";

  console.log(
      chalk.gray(id),
      chalk.dim("→"),
      chalk.green("RESPONSE")
  );
};