import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

// add money controller
const addMoney = catchAsync(async (req: Request, res: Response) => {
  const { amount, paymentMethod, description } = req.body;

  const result = await TransactionService.addMoneyService(
    req.user,
    amount,
    paymentMethod,
    description
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Money added successfully",
    data: result,
  });
});

// withdraw money controller
const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const { amount, paymentMethod, description } = req.body;

  const result = await TransactionService.withdrawMoneyService(
    req.user,
    amount,
    paymentMethod,
    description
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Money withdraw successfully",
    data: result,
  });
});

export const TransactionController = {
    addMoney,
  withdrawMoney,
};
