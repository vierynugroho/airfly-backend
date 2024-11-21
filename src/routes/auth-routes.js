import { Router } from "express";
import { authHandler } from "../handler/auth-handler";

export const authRouter = Router()

authRouter.get('/', authHandler)