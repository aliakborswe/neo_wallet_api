import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status-codes";

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
    statusCode: httpStatus.OK,
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
    statusCode: httpStatus.OK,
    success: true,
    message: "Money withdraw successfully",
    data: result,
  });
});

// send money controller
const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const { amount, receiverEmail, description } = req.body;

  const result = await TransactionService.sendMoneyService(
    req.user,
    amount,
    receiverEmail,
    description
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Send money successfully",
    data: result,
  });
});

// cash in controller
const cashInFromAgent = catchAsync(async (req: Request, res: Response) => {
  const { amount, receiverEmail, description } = req.body;


  const result = await TransactionService.cashIn(
    req.user,
    amount,
    receiverEmail,
    description
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash in successfully",
    data: result,
  });
});

// cash out controller
const cashOut = catchAsync(async (req: Request, res: Response) => {
  const { amount, receiverEmail, description } = req.body;

  const result = await TransactionService.cashOut(
    req.user,
    amount,
    receiverEmail,
    description
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash out successfully",
    data: result,
  });
});

// get my transactions
// get all transactions
const getMyAllTransaction = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const user = req.user;
  const result = await TransactionService.getMyAllTransaction(
    query as Record<string, string>,
    user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Transaction retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// for admin
// get all transactions
const getAllTransaction = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TransactionService.getAllTransaction(
    query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const TransactionController = {
  addMoney,
  withdrawMoney,
  sendMoney,
  cashInFromAgent,
  cashOut,
  getAllTransaction,
  getMyAllTransaction,
};
