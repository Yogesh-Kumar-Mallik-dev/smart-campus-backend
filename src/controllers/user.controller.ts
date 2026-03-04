import { User, Role } from "@/models/user.model";
import { generateTempId } from "@/services/user.service";

/* =========================================================
   CREATE USER
========================================================= */

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

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    throw new Error("Email already exists");
  }

  const tempId = await generateTempId(roles);

  /*
  ARCHITECTURE RULE
  tempId === initial password
  */

  await User.create({
    full_name: full_name.trim(),
    academic_name: academic_name.trim(),
    email: normalizedEmail,
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

/* =========================================================
   UPDATE USER
========================================================= */

interface UpdateUserInput {
  requesterId: string;
  requesterRoles: Role[];
  targetUserId: string;

  full_name?: string;
  academic_name?: string;
  email?: string;
  roles?: Role[];
  memberId?: string | null;
}

export const updateUserController = async ({
                                             requesterId,
                                             requesterRoles,
                                             targetUserId,
                                             full_name,
                                             academic_name,
                                             email,
                                             roles,
                                             memberId,
                                           }: UpdateUserInput) => {

  const user = await User.findById(targetUserId);

  if (!user) {
    throw new Error("User not found");
  }

  const isRegistrar = requesterRoles.includes(Role.REGISTRAR);
  const isSelf = requesterId === user._id.toString();

  if (full_name !== undefined) {
    if (!isRegistrar) {
      throw new Error("Only registrar can update full name");
    }
    user.full_name = full_name.trim();
  }

  if (academic_name !== undefined) {
    if (!isRegistrar) {
      throw new Error("Only registrar can update academic name");
    }
    user.academic_name = academic_name.trim();
  }

  if (roles !== undefined) {
    if (!isRegistrar) {
      throw new Error("Only registrar can update roles");
    }

    if (roles.length === 0) {
      throw new Error("User must have at least one role");
    }

    if (
        user.roles.includes(Role.REGISTRAR) &&
        !roles.includes(Role.REGISTRAR)
    ) {
      throw new Error("Registrar role cannot be removed");
    }

    user.roles = roles;
  }

  if (memberId !== undefined) {
    if (!isRegistrar) {
      throw new Error("Only registrar can update member ID");
    }

    user.memberId = memberId;
  }

  if (email !== undefined) {

    if (!isSelf && !isRegistrar) {
      throw new Error("You cannot update another user's email");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id },
    });

    if (existing) {
      throw new Error("Email already exists");
    }

    user.email = normalizedEmail;
  }

  await user.save();

  return {
    message: "User updated successfully",
  };
};