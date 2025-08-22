import mongoose from "mongoose";
import { Role } from "../user/user.interface";
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { Transaction } from "./transaction.model";
import { JwtPayload } from "jsonwebtoken";
import { TransactionStatus, TransactionType } from "./transaction.interface";

const addMoneyService = async (
  user: JwtPayload,
  amount: number,
  paymentMethod: string,
  description?: string
) => {
  const userId = user.userId as string;
  const session = await mongoose.startSession();

  if (user.role !== Role.USER) {
    throw new Error("Only users can add money to their wallet");
  }

  try {
    session.startTransaction();

    // Get user's wallet
    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.status !== WalletStatus.ACTIVE) {
      throw new Error("Wallet is blocked or inactive");
    }

    // Calculate fee (1% for add money, max ৳10)
    const feeRate = 0.01;
    const fee = Math.min(amount * feeRate, 1000) / 100;

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          userId: userId,
          type: TransactionType.ADD_MONEY,
          amount,
          fee,
          receiverId: userId,
          senderBalanceBefore: wallet.balance,
          senderBalanceAfter: wallet.balance + amount,
          description: description || "Add money to wallet",
          paymentMethod,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save({ session });

    await session.commitTransaction();

    return {
      transaction: transaction[0],
      newBalance: wallet.balance / 100, // Convert back to currency
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};

export const TransactionService = {
  addMoneyService,
};
