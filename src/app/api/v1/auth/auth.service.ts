import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../../helpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import  jwt, { JwtPayload, SignOptions }  from "jsonwebtoken";
import { envVars } from "../../../config/env";
import { createUserTokens } from "../../../utils/userTokens";

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

  const {password: pass, ...rest} = isUserExist.toObject();
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
    };
};

// get new access token using refresh token


export const AuthService = {
  credentialsLogin,
};
