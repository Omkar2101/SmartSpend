import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";
import gmailRoutes from "../modules/gmail/gmail.routes";
import emailRoutes from "../modules/email/email.routes";
import expenseRoutes from "../modules/expense/expense.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/gmail", gmailRoutes);
router.use("/emails", emailRoutes);
router.use("/expense", expenseRoutes);
router.use("/expenses", expenseRoutes);

export default router;
