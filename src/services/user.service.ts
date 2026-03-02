import { Role, User } from "@/models/user.model";

const rolePrefixMap: Record<Role, string> = {
  [Role.STUDENT]: "SC-STU",
  [Role.TEACHER]: "SC-TCH",
  [Role.ADMIN]: "SC-ADM",
  [Role.MESS]: "SC-MES",
  [Role.REGISTRAR]: "SC-REG",
};

export const generateTempId = async (roles: Role[]): Promise<string> => {
  const prefix = rolePrefixMap[roles[0]];

  while (true) {
    const random = Math.floor(1000 + Math.random() * 9000);
    const tempId = `${prefix}-${random}`;

    const exists = await User.findOne({ tempId });
    if (!exists) return tempId;
  }
};