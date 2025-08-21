import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    transactionId: { type: String, unique: true, required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
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
transactionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await model("Transaction").countDocuments();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const day = String(new Date().getDate()).padStart(2, "0");

    this.transactionId = `TXN${year}${month}${day}${String(count + 1).padStart(
      6,
      "0"
    )}`;
  }
  next();
});

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
