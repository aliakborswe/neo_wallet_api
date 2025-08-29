import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { UserServices } from "./user.service";

// Create a new user
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

// Get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Users Retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// Get all agents
const getAllAgents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllAgents();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Agent Retrieved successfully",
      data: result.data,
    });
  }
);

// Get current logged in user
const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.getCurrentUser(req.user.userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Current User Retrieved successfully",
      data: user,
    });
  }
);

// Update user information
const updateUserInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedUser = await UserServices.updateUserInfo(req.body, req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }
);

// Approved or Suspend agent status
const agentApprovalStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedUser = await UserServices.agentApprovalStatusService(
      req.body.agentId,
      req.body.approvalStatus
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent Status updated successfully",
      data: updatedUser,
    });
  }
);

export const userControllers = {
  createUser,
  getAllUsers,
  getCurrentUser,
  updateUserInfo,
  agentApprovalStatus,
  getAllAgents,
};
