import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";
import AppError from "../../../helpers/AppError";
import { Wallet } from "../wallet/wallet.model";
import { IAgentInfo, IUser, Role, UserStatus } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";

// create a new user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  if (!email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email and password are required"
    );
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User already exists with this email"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const userData: Partial<IUser> = {
    ...rest,
    email,
    password: hashedPassword,
  };

  if (payload.role === Role.AGENT) {
    userData.agentInfo = {
      commissionRate: 1.5,
      approvalStatus: "PENDING",
    };
  }

  const user = await User.create(userData);
  // create wallet
  if (user.role === "USER" || user.role === "AGENT") {
    await Wallet.create({
      userId: user._id,
      account: user.email,
      balance: 50, // default balance in tk
    });
  }
  return user;
};

// get all users
const getAllUsers = async () => {
  const users = await User.find({});

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

// get current logged in user
const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

// update user information
const updateUserInfo = async (
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(decodedToken.userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    isUserExist.isDeleted ||
    isUserExist.userStatus === UserStatus.BLOCKED ||
    isUserExist.userStatus === UserStatus.SUSPEND
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "");
  }

  if (decodedToken.role === Object.values(Role)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this user"
    );
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    decodedToken.userId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  return updatedUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getCurrentUser,
  updateUserInfo,
};
