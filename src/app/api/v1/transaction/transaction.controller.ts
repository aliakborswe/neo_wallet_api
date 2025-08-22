import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

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

export const TransactionController = {
  addMoney,
};
