import { Request, Response } from "express";
import { User, Role } from "@/models/user.model";
import { generateTempId } from "@/services/user.service";

interface CreateUserBody {
  name?: string;
  email?: string;
  roles?: Role[];
  memberId?: string | null;
}

export const createUserAPI = async (
    req: Request<{}, {}, CreateUserBody>,
    res: Response
): Promise<Response> => {
  try {
    const { name, email, roles, memberId } = req.body;

    /* ---------------- VALIDATION ---------------- */

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        message: "Valid name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!roles || roles.length === 0) {
      return res.status(400).json({
        message: "At least one role is required",
      });
    }

    // Validate roles are valid enum values
    const invalidRole = roles.find(
        (role) => !Object.values(Role).includes(role)
    );

    if (invalidRole) {
      return res.status(400).json({
        message: `Invalid role: ${invalidRole}`,
      });
    }

    /* ------------ SINGLE REGISTRAR RULE ------------ */

    if (roles.includes(Role.REGISTRAR)) {
      const existingRegistrar = await User.findOne({
        roles: Role.REGISTRAR,
      });

      if (existingRegistrar) {
        return res.status(400).json({
          message: "Only one registrar is allowed in the system",
        });
      }
    }

    /* ---------------- CREATE USER ---------------- */

    const tempId = await generateTempId(roles);

    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      roles,
      memberId: memberId || null,
      tempId,
      password: tempId,
    });

    return res.status(201).json({
      message: "User created successfully",
      tempId,
    });

  } catch (error: unknown) {
    return res.status(500).json({
      message:
          error instanceof Error
              ? error.message
              : "User creation failed",
    });
  }
};