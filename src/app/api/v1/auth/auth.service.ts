import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../../helpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import {
  createAccessTokenFromRefresh,
  createUserTokens,
} from "../../../utils/userTokens";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Email or password is incorrect"
    );
  }

  const userTokens = createUserTokens(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

// get new access token using refresh token
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenFromRefresh(refreshToken);
  return {
    accessToken: newAccessToken,
  };
};

// reset password
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatched = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(process.env.BCRYPT_SALT_ROUND)
  );
  user!.save();
};

export const AuthService = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
