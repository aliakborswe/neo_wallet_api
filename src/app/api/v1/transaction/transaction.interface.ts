import { Types } from "mongoose";

export enum TransactionType {
  ADD_MONEY = "ADD_MONEY",
  SEND_MONEY = "SEND_MONEY",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  userID?: Types.ObjectId;
  transactionId?: string;
  type: TransactionType;
  amount: number;
  fee?: number;
  senderId: Types.ObjectId;
  receiverId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  description?: string;
  status?: TransactionStatus;
}
