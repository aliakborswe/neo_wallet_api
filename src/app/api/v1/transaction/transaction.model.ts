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
    amount: { type: Number, required: true }, // amount should be in paisa
    fee: { type: Number, default: 0 },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    senderBalanceBefore: { type: Number },
    senderBalanceAfter: { type: Number },
    receiverBalanceBefore: { type: Number },
    receiverBalanceAfter: { type: Number },
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
