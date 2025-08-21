import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login",AuthController.credentialsLogin)


export const AuthRoute = router;