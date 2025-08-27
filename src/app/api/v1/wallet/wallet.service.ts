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
    // return wallet;
  }

  wallet.status = status as WalletStatus;
  await wallet.save();
  return wallet;
};

export const WalletService = {
  walletBlockUnblock,
};
