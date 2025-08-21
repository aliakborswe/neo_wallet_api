import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../helpers/AppError";
import { handlerDuplicateError } from "../helpers/handlerDuplicateError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(envVars.NODE_ENV === "development"){
    console.log(err)
  }

  let errorSources: any = [];
  let statusCode = 500;
  let message = `Something went wrong!! ${err.message}`;

  // Duplicate error
  if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }


  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
