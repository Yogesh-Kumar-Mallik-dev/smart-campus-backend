import { User, Role } from "@/models/user.model";
import { generateTempId } from "@/services/user.service";

/* ================= CREATE USER ================= */

interface CreateUserInput {
  full_name: string;
  academic_name: string;
  email: string;
  roles: Role[];
  memberId?: string | null;
}

export const createUserController = async ({
                                             full_name,
                                             academic_name,
                                             email,
                                             roles,
                                             memberId,
                                           }: CreateUserInput) => {

  if (!full_name || full_name.trim().length < 2) {
    throw new Error("Valid full name is required");
  }

  if (!academic_name || academic_name.trim().length < 2) {
    throw new Error("Valid academic name is required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!roles || roles.length === 0) {
    throw new Error("At least one role is required");
  }

  const tempId = await generateTempId(roles);

  await User.create({
    full_name: full_name.trim(),
    academic_name: academic_name.trim(),
    email: email.toLowerCase().trim(),
    roles,
    memberId: memberId || null,
    tempId,
    password: tempId,
  });

  return {
    message: "User created successfully",
    tempId,
  };
};

/* ================= UPDATE USER (REGISTRAR ONLY) ================= */

interface UpdateUserInput {
  targetUserId: string;
  full_name?: string;
  academic_name?: string;
  memberId?: string | null;
}

export const updateUserController = async ({
                                             targetUserId,
                                             full_name,
                                             academic_name,
                                             memberId,
                                           }: UpdateUserInput) => {

  const user = await User.findById(targetUserId);

  if (!user) {
    throw new Error("User not found");
  }

  if (full_name !== undefined) {
    if (full_name.trim().length < 2) {
      throw new Error("Full name must be at least 2 characters");
    }
    user.full_name = full_name.trim();
  }

  if (academic_name !== undefined) {
    if (academic_name.trim().length < 2) {
      throw new Error("Academic name must be at least 2 characters");
    }
    user.academic_name = academic_name.trim();
  }

  if (memberId !== undefined) {
    user.memberId = memberId;
  }

  await user.save();

  return {
    message: "User updated successfully",
    user: {
      id: user.id,
      full_name: user.full_name,
      academic_name: user.academic_name,
      memberId: user.memberId,
      roles: user.roles,
    },
  };
};