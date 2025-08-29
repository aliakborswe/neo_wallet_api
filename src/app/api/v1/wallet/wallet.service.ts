import { JwtPayload } from "jsonwebtoken";
import AppError from "../../../helpers/AppError";
import { IWallet, WalletStatus } from "./wallet.interface";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";

const walletBlockUnblock = async (payload: Partial<IWallet>) => {
  const { _id, status } = payload;

  if (!_id || !status) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Wallet _id and status are required"
    );
  }

  const wallet = await Wallet.findOne({ _id });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  // If wallet already has the same status, don’t update
  if (wallet.status === status) {
    return wallet;
  }

  wallet.status = status as WalletStatus;
  await wallet.save();
  return wallet;
};

//  get my wallet
const getMyWallet = async (payload: JwtPayload) => {
  const { userId } = payload;

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  return wallet;
};

// for admin
// get all wallets
const getAllWallet = async (query: Record<string, string>) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const wallets = await Wallet.find()
    .populate("userId", "name email")
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  const totalWallet = await Wallet.countDocuments();

  return {
    data: wallets,
    meta: {
      total: totalWallet,
    },
  };
};

export const WalletService = {
  walletBlockUnblock,
  getAllWallet,
  getMyWallet,
};
