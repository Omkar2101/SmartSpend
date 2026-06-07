import { Router } from "express";
import { EmailController } from "./email.controller";

const router = Router();

const emailController = new EmailController();

// Add your routes here

export default router;
