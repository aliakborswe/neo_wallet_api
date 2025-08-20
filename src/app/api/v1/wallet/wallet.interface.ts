import { Types } from "mongoose";

export enum IsActive {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}
export interface IWallet {
    _id?: string;
    userId: Types.ObjectId;
    balance: number;
    isActive: IsActive;
}