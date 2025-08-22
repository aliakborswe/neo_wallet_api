import mongoose from "mongoose";
import { UserStatus } from "../user/user.interface";
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { Transaction } from "./transaction.model";
import { JwtPayload } from "jsonwebtoken";
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";
import AppError from "../../../helpers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";

// add money service
const addMoneyService = async (
  user: JwtPayload,
  amount: number,
  paymentMethod: string,
  description?: string
) => {
  const userId = user.userId as string;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Get user's wallet
    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    if (wallet.status !== WalletStatus.ACTIVE) {
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
          toAccount: user.email,
          fromAccount: user.email,
          type: TransactionType.ADD_MONEY,
          amount,
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

  try {
    session.startTransaction();

    // Get user's wallet
    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    if (wallet.status !== WalletStatus.ACTIVE) {
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
          toAccount: user.email,
          fromAccount: user.email,
          type: TransactionType.WITHDRAW_MONEY,
          amount,
          fee,
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

// send money service
const sendMoneyService = async (
  user: JwtPayload,
  amount: number,
  description: string,
  receiverEmail: string
) => {
  const userId = user.userId as string;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const senderWallet = await Wallet.findOne({ userId }).session(session);
    if (!senderWallet)
      throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");

    const receiverUser = await User.findOne({ email: receiverEmail });
    if (!receiverUser)
      throw new AppError(httpStatus.NOT_FOUND, "Receiver not found");

    const receiverWallet = await Wallet.findOne({
      userId: receiverUser._id,
    }).session(session);
    if (!receiverWallet)
      throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");

    // status checks
    if (senderWallet.status !== WalletStatus.ACTIVE) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Sender wallet is blocked/inactive"
      );
    }
    if (
      receiverWallet.status !== WalletStatus.ACTIVE ||
      receiverUser.userStatus !== UserStatus.ACTIVE
    ) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Receiver wallet or profile is blocked/inactive"
      );
    }

    // fee logic
    const fee = 5;
    const totalAmount = amount + fee;

    if (senderWallet.balance < totalAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    // sender transaction
    const senderTx = await Transaction.create(
      [
        {
          userId,
          toAccount: user.email,
          fromAccount: receiverEmail,
          type: TransactionType.SEND_MONEY,
          amount,
          fee,
          receiverId: receiverUser._id,
          senderBalanceBefore: senderWallet.balance,
          senderBalanceAfter: senderWallet.balance - totalAmount,
          description: description || "Send money",
          paymentMethod: PaymentMethod.NEO_WALLET,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    // update sender balance
    senderWallet.balance -= totalAmount;
    await senderWallet.save({ session });

    // receiver transaction
    const receiverTx = await Transaction.create(
      [
        {
          userId: receiverUser._id,
          toAccount: receiverEmail,
          fromAccount: user.email,
          type: TransactionType.RECEIVE_MONEY, // make sure enum has this
          amount,
          senderId: userId,
          receiverBalanceBefore: receiverWallet.balance,
          receiverBalanceAfter: receiverWallet.balance + amount,
          description: description || "Receive money",
          paymentMethod: PaymentMethod.NEO_WALLET,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    // update receiver balance
    receiverWallet.balance += amount;
    await receiverWallet.save({ session });

    await session.commitTransaction();

    return { senderTx, receiverTx };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  } finally {
    session.endSession();
  }
};

// cash-in from agent
const cashInFromAgent = async (
  user: JwtPayload,
  amount: number,
  description: string,
  receiverEmail: string
) => {
  const session = await mongoose.startSession();
  try {
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  } finally {
    session.endSession();
  }
};

export const TransactionService = {
  addMoneyService,
  withdrawMoneyService,
  sendMoneyService,
};
