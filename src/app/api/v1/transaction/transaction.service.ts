import mongoose from "mongoose";
import { Role, UserStatus } from "../user/user.interface";
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { Transaction } from "./transaction.model";
import { JwtPayload } from "jsonwebtoken";
import { TransactionStatus, TransactionType } from "./transaction.interface";
import AppError from "../../../helpers/AppError";
import httpStatus from "http-status-codes";

// add money service
const addMoneyService = async (
  user: JwtPayload,
  amount: number,
  paymentMethod: string,
  description?: string
) => {
  const userId = user.userId as string;
  const session = await mongoose.startSession();

  if (user.role !== Role.USER) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Only users can add money to their wallet"
    );
  }

  try {
    session.startTransaction();

    // Get user's wallet
    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    if (
      wallet.status !== WalletStatus.ACTIVE &&
      user.userStatus !== UserStatus.ACTIVE
    ) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Wallet is blocked or inactive"
      );
    }

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          userId: userId,
          type: TransactionType.ADD_MONEY,
          amount,
          receiverId: userId,
          receiverBalanceBefore: wallet.balance,
          receiverBalanceAfter: wallet.balance + amount,
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
      transaction,
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};

//  withdraw money service
const withdrawMoneyService = async (
  user: JwtPayload,
  amount: number,
  paymentMethod: string,
  description?: string
) => {
  const userId = user.userId as string;
  const session = await mongoose.startSession();

  if (user.role !== Role.USER) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Only users can withdraw money from their wallet"
    );
  }

  try {
    session.startTransaction();

    // Get user's wallet
    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    if (
      wallet.status !== WalletStatus.ACTIVE &&
      user.userStatus !== UserStatus.ACTIVE
    ) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Wallet is blocked or inactive"
      );
    }

    // Calculate fee (1% for withdraw money, max ৳10)
    const feeRate = 0.01;
    const fee = Math.min(amount * feeRate, 1000) / 100;
    const totalAmount = amount + fee;

    if (wallet.balance < totalAmount) {
      await session.abortTransaction();
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          userId: userId,
          type: TransactionType.WITHDRAW_MONEY,
          amount,
          fee,
          senderId: userId,
          senderBalanceBefore: wallet.balance,
          senderBalanceAfter: wallet.balance - totalAmount,
          description: description || "Withdraw money from wallet",
          paymentMethod,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    // Update wallet balance
    wallet.balance -= totalAmount;
    await wallet.save({ session });

    await session.commitTransaction();

    return {
      transaction,
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
  withdrawMoneyService,
};
