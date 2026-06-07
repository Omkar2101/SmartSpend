import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";

import { UserController } from "./user.controller";

const router = Router();

const userController = new UserController();

router.get("/me", requireAuth, userController.getMe);

export default router;
