import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../../middlewares/validateRequest";
import {
  addMoneyZodSchema,
  cashInZodSchema,
  sendMoneyZodSchema,
  withdrawMoneyZodSchema,
} from "./transaction.validation";

const router = Router();

router.post(
  "/add-money",
  checkAuth(Role.USER),
  validateRequest(addMoneyZodSchema),
  TransactionController.addMoney
);
router.post(
  "/withdraw-money",
  checkAuth(Role.USER),
  validateRequest(withdrawMoneyZodSchema),
  TransactionController.withdrawMoney
);
router.post(
  "/send-money",
  checkAuth(Role.USER),
  validateRequest(sendMoneyZodSchema),
  TransactionController.sendMoney
);
router.post(
  "/cash-in",
  checkAuth(Role.AGENT),
  validateRequest(cashInZodSchema),
  TransactionController.cashInFromAgent
);


export const TransactionRoute = router;
