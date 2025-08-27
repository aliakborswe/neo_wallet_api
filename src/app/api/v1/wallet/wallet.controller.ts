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

export const WalletController = {
  walletBlockUnblock,
};
