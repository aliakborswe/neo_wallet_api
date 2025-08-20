import { Request, Response } from "express";

const user = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to user",
  });
};

export const V1Controller = {
  user,
};
