/* eslint-disable @typescript-eslint/no-unused-vars */
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
// get my wallet
const getMyWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WalletService.getMyWallet(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Wallet Retrieved successfully",
      data: result,
    });
  }
);

// admin controller
// Get all wallets
const getAllWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WalletService.getAllWallet(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Wallet Retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const WalletController = {
  walletBlockUnblock,
  getAllWallet,
  getMyWallet,
};
