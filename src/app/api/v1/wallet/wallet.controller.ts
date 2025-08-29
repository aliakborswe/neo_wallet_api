import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { WalletService } from "./wallet.service";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status-codes";

// Update user wallet status
const walletBlockUnblock = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedUser = await WalletService.walletBlockUnblock(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wallet Status updated successfully",
      data: updatedUser,
    });
  }
);

// Get all wallets
const getAllWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WalletService.getAllWallet()

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Wallet Retrieved successfully",
      data: result.data,
    });
  }
);

export const WalletController = {
  walletBlockUnblock,
  getAllWallet,
};
