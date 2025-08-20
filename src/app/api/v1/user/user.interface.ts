import { Types } from "mongoose";

export enum IsActive {
  ACTIVE = "ACTIVE",
  SUSPEND = "SUSPEND",
  BLOCKED = "BLOCKED",
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  USER = "USER",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  picture?: string;
  address?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  agentCommission?: number;
}
