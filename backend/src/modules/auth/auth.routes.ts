import { Router } from "express";
import { AuthController } from "./auth.controller"
import { validate } from "../../middleware/validate";

import {
  registerUserSchema,
} from "../../validations/auth.validation";

const router = Router();
const authController = new AuthController();

router.post("/register", validate(registerUserSchema), authController.register);
router.get("/users", authController.getUsers);


export default router;
