import { Router } from "express";
import { authHandler } from "../controllers/auth";

export const authRouter = Router()

authRouter.get('/', authHandler)