
import cors from "cors"; 
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router)

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


export default app;