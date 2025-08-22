import { Router } from "express";
import { UserRoutes } from "../api/v1/user/user.route";
import { AuthRoute } from "../api/v1/auth/auth.route";
import { TransactionRoute } from "../api/v1/transaction/transaction.route";

export const router = Router();

const apiRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/transaction",
    route: TransactionRoute,
  },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
