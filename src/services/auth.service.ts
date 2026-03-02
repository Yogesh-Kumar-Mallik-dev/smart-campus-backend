import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import { Token } from "@/models/token.model";

export const loginService = async (
    identifier: string,
    password: string
) => {
  const user = await User.findOne({
    $or: [
      { tempId: identifier },
      { memberId: identifier },
    ],
  }).select("+password");

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (user.status !== "ACTIVE") {
    throw new Error("User inactive");
  }

  await Token.deleteMany({ user: user._id });

  const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string
  );

  await Token.create({ user: user._id, token });

  return { user, token };
};

export const logoutService = async (token: string) => {
  await Token.deleteOne({ token });
};