import { Request, Response, Router } from "express";
import { UserRoutes } from "../api/v1/user/user.route";

export const router = Router();

const apiRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

apiRoutes.forEach((route)=> {
    router.use(route.path, route.route);
})