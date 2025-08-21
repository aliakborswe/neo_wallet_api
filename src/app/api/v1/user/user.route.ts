import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "./user.interface";
const router = Router();

router.post("/register", userController.createUser);
router.get(
  "/all-user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers
);


export const UserRoutes = router;
