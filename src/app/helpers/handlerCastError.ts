import mongoose from "mongoose";
import { TGenericErrorResponse } from "../types/error.types";

export const handlerCastError = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid Mongodb ObjectId. Please provide a valid id",
  };
};
