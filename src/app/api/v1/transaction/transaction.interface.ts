import { Types } from "mongoose";

export enum TransactionType {
  ADD_MONEY = "ADD_MONEY",
  WITHDRAW_MONEY = "WITHDRAW_MONEY",
  SEND_MONEY = "SEND_MONEY",
  RECEIVE_MONEY = "RECEIVE_MONEY",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum PaymentMethod {
  BANK = "BANK",
  CARD = "CARD",
  NEO_WALLET = "NEO_WALLET",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  userId?: Types.ObjectId;
  toAccount: string;
  fromAccount: string;
  transactionId?: string;
  type: TransactionType;
  amount: number;
  paymentMethod?: PaymentMethod;
  fee?: number;
  senderBalanceBefore?: Number;
  senderBalanceAfter?: Number;
  receiverBalanceBefore?: Number;
  receiverBalanceAfter?: Number;
  description?: string;
  status?: TransactionStatus;
}
