import { model, Schema } from "mongoose";
import { customAlphabet } from "nanoid";
import {
  ITransaction,
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: { type: String, unique: true },
    toAccount: { type: String, required: true },
    fromAccount: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: false,
    },
    amount: {
      type: Number,
      required: true,
      get: (value: number) => value / 100,
      set: (value: number) => value * 100,
    },
    fee: {
      type: Number,
      default: 0,
      get: (value: number) => value / 100,
      set: (value: number) => value * 100,
    },
    senderBalanceBefore: {
      type: Number,
      get: (value: number) => value / 100,
      set: (value: number) => value * 100,
    },
    senderBalanceAfter: {
      type: Number,
      get: (value: number) => value / 100,
      set: (value: number) => value * 100,
    },
    receiverBalanceBefore: {
      type: Number,
      get: (value: number) => value / 100,
      set: (value: number) => value * 100,
    },
    receiverBalanceAfter: {
      type: Number,
      get: (value: number) => value / 100,
      set: (value: number) => value * 100,
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

// Pre-save middleware to generate transaction ID
const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);
transactionSchema.pre("save", function (next) {
  if (this.isNew) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    this.transactionId = `TXN${date}${nanoid()}`;
  }
  next();
});

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
