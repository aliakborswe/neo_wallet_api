import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
const router = Router();

router.post("/register",validateRequest(createUserZodSchema), userControllers.createUser);
router.get(
  "/all-user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsers
);


export const UserRoutes = router;
