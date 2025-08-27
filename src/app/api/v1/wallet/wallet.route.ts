import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.patch(
  "/status",
  checkAuth(Role.ADMIN),
  WalletController.walletBlockUnblock
);

export const WalletRoutes = router;
