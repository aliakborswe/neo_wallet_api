import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../helpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../api/v1/user/user.model";
import { UserStatus } from "../api/v1/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const accessToken = req.headers.authorization || req.cookies.accessToken;
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        throw new AppError(401, "No token received, please login first");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      if (
        isUserExist.userStatus === UserStatus.BLOCKED ||
        isUserExist.userStatus === UserStatus.SUSPEND
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.userStatus}`
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "Your are not permitted to access this route");
      }
      req.user = verifiedToken; // pass the verifiedToke to controllers with global type Express
      next();
    } catch (err) {
      next(err);
    }
  };
