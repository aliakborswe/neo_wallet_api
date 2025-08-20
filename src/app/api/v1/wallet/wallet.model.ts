import { model, Schema, Types } from "mongoose";
import { IsActive, IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    walletId: { type: String, unique: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0, required: true }, // balance should be in paisa
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    accountNumber: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);