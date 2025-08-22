import { model, Schema, Types } from "mongoose";
import { WalletStatus, IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    account: { type: String, required: true, unique: true },
    balance: {
      type: Number,
      default: 0,
      required: true,
      get: (value: number) => value / 100, // convert paisa → currency
      set: (value: number) => value * 100, // balance store in paisa
    },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Instance method to check if wallet can transact
walletSchema.methods.canTransact = function () {
  return this.status === WalletStatus.ACTIVE;
};

export const Wallet = model<IWallet>("Wallet", walletSchema);
