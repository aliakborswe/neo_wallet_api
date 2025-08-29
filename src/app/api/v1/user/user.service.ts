import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";
import AppError from "../../../helpers/AppError";
import { Wallet } from "../wallet/wallet.model";
import {
  AgentStatus,
  IAgentInfo,
  IUser,
  Role,
  UserStatus,
} from "./user.interface";
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
      totalCommission: 0,
      txnfees: 20,
    } as IAgentInfo;
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
  const users = await User.find({ role: Role.USER });

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

// get all agents
const getAllAgents = async () => {
  const agents = await User.find({ role: Role.AGENT });

  return {
    data: agents,
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

// for agent
// agent approval status
const agentApprovalStatusService = async (
  _id: string,
  approvalStatus: Partial<AgentStatus>
) => {
  if (!_id || !approvalStatus) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Agent id and status are required"
    );
  }

  const agent = await User.findOne({ _id });
  if (!agent || agent.role !== Role.AGENT) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  // If agent approval status already has the same status, don’t update
  if (agent.agentInfo?.approvalStatus === approvalStatus) {
    return agent; // no update needed
  }

  if (!agent.agentInfo) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent info not found");
  }

  agent.agentInfo.approvalStatus = approvalStatus;
  await agent.save();

  return agent;
};

const setAgentTxnFee = async (_id: string, transactionFee: number) => {
  if (!_id || !transactionFee) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Agent id and Transaction fee are required"
    );
  }

  const agent = await User.findOne({ _id });
  if (!agent || agent.role !== Role.AGENT) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  if (!agent.agentInfo) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent info not found");
  }

  agent.agentInfo.txnfees = transactionFee;
  await agent.save();

  return agent;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getCurrentUser,
  updateUserInfo,
  agentApprovalStatusService,
  getAllAgents,
  setAgentTxnFee,
};
