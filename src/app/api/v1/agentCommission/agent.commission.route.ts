import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { commissionController } from "./agent.commission.controller";


const router = Router();

router.get(
  "/",
  checkAuth(Role.AGENT),
  commissionController.myCommissionHistory
);

export const commissionRoute = router