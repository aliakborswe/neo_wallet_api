import { Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    transactionId: { type: String, unique: true, required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true }, // amount should be in paisa
    fee: { type: Number, default: 0 },
    senderWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    receiverWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
