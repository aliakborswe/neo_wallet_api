import { Router } from "express";
import { V1Controller } from "./user.controller";
const router = Router();

router.get("/user", V1Controller.user);

export const UserRoutes = router;
