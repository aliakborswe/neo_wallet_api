import { Router } from "express";
import { UserRoutes } from "../api/v1/user/user.route";
import { AuthRoute } from "../api/v1/auth/auth.route";
import { TransactionRoute } from "../api/v1/transaction/transaction.route";
import { WalletRoutes } from "../api/v1/wallet/wallet.route";
import { commissionRoute } from "../api/v1/agentCommission/agent.commission.route";

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
  {
    path: "/wallet",
    route: WalletRoutes,
  },
  {
    path: "/commission",
    route: commissionRoute,
  },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
