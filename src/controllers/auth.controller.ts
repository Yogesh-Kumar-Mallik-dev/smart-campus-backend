import { loginService } from "@/services/auth.service";

interface LoginInput {
  identifier: string;
  password: string;
}

export const loginController = async ({
                                        identifier,
                                        password,
                                      }: LoginInput) => {
  const { user, token } = await loginService(identifier, password);

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      roles: user.roles,
    },
  };
};