import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

const userController =
  new UserController();

router.post(
  "/sync",
  userController.syncUser
);

export default router;