import cors from "cors";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to NeoWallet",
  });
});
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "NeoWallet is running healthy",
  });
});

// global error handler
app.use(globalErrorHandler);
// not found route handler
app.use(notFound);

export default app;
