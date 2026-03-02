import { Response, NextFunction } from "express";
import { Role } from "@/models/user.model";

type Mode = "OR" | "AND";

export const authorize =
    (requiredRoles: Role[], mode: Mode = "OR") =>
        (req: any, res: Response, next: NextFunction) => {
          const userRoles: Role[] = req.user.roles;

          if (mode === "OR") {
            const hasRole = requiredRoles.some((r) =>
                userRoles.includes(r)
            );
            if (!hasRole)
              return res.status(403).json({ message: "Forbidden" });
          }

          if (mode === "AND") {
            const hasAll = requiredRoles.every((r) =>
                userRoles.includes(r)
            );
            if (!hasAll)
              return res.status(403).json({ message: "Forbidden" });
          }

          next();
        };