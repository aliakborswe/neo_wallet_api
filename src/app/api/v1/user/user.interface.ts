import { Types } from "mongoose";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPEND = "SUSPEND",
  BLOCKED = "BLOCKED",
}

export enum AgentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPEND = "SUSPEND",
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  USER = "USER",
}

export interface IAgentInfo {
  commissionRate: number;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  commission: number;
  txnfees: number;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  picture?: string;
  address?: string;
  userStatus?: UserStatus;
  isVerified?: boolean;
  isDeleted?: string;
  role?: Role;
  agentInfo?: IAgentInfo;
}
