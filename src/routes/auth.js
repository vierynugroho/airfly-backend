import { Router } from "express";
import { authHandler } from "../controllers/auth.js";

export const authRouter = Router()

authRouter.post('/', authHandler)