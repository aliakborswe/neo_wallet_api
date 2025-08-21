import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
router.get(
  "/all-user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsers
);
router.get(
  "/profile",
  checkAuth(...Object.values(Role)),
  userControllers.getCurrentUser
);
router.patch(
  "/update-profile",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  userControllers.updateUserInfo
);

export const UserRoutes = router;
