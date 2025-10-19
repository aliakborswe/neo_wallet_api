/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../../utils/setCookie";
import AppError from "../../../helpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful",
      data: loginInfo,
    });
  }
);

// get new access token using refresh token
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token received from cookies"
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access Token Retrieved Successful",
      data: tokenInfo,
    });
  }
);

// reset password
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;

    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

// user logout

const isProduction = envVars.NODE_ENV === "production";
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logout Successful",
      data: null,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
  logout,
};
