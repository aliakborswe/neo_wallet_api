/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../types/error.types";


export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
  const matchedArr = err.message.match(/"([^"]*)"/);

  return {
    statusCode: 400,
    message: `${matchedArr[1]} Already exists!!`,
  };
};
