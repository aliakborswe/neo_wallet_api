import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}
export interface IWallet {
  _id?: string;
  userId: Types.ObjectId;
  balance: number;
  status: WalletStatus;
}
