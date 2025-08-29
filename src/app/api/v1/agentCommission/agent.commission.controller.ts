import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import httpStatus from 'http-status-codes'
import { sendResponse } from "../../../utils/sendResponse";
import { AgentCommissionHistory } from "./agent.commission.service";

// Get all commission
const myCommissionHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AgentCommissionHistory.myCommissionHistory(req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Commission Retrieved successfully",
      data: result.data,
    });


  }
);


export const commissionController = {
  myCommissionHistory,
};