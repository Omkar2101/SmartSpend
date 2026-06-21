import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";

import { ExpenseController } from "./expense.controller";

const router = Router();

const expenseController = new ExpenseController();

router.post(
  "/process/:emailId",

  requireAuth,

  expenseController.processExpense,
);

export default router;
