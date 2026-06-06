import { Router } from "express";
import { UserController } from "./user.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

const userController =
  new UserController();

router.post(
  "/sync",
  userController.syncUser
);


router.get(
  "/me",
  requireAuth,
  (req, res) => {

    res.json({
      success: true,
      message:
        "Protected Route Works"
    });

  }
);
export default router;