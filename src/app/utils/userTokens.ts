import { generateToken } from "./jwt";
import { envVars } from "../config/env";
import { IUser } from "../api/v1/user/user.interface";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES_IN
  );

  return {
    accessToken,
  };
};
