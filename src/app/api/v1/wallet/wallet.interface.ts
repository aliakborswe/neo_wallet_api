import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  SUSPEND = "SUSPEND",
  BLOCKED = "BLOCKED",
}
export interface IWallet {
  _id?: string;
  userId: Types.ObjectId;
  account: string;
  balance: number;
  status?: WalletStatus;
}
