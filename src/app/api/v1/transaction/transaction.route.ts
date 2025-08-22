import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../../middlewares/validateRequest";
import { addMoneyZodSchema } from "./transaction.validation";

const router = Router();

router.post(
  "/add-money",
  checkAuth(Role.USER),
  validateRequest(addMoneyZodSchema),
  TransactionController.addMoney
);

export const TransactionRoute = router;
