import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { ExpenseController } from "./expense.controller";

const router = Router();
const expenseController = new ExpenseController();

// Define /stats first to prevent it from matching /:id pattern
router.get("/stats", requireAuth, expenseController.getExpenseStats);

router.get("/", requireAuth, expenseController.listExpenses);
router.get("/:id", requireAuth, expenseController.getExpenseDetails);

router.post("/", requireAuth, expenseController.createExpense);
router.put("/:id", requireAuth, expenseController.updateExpense);
router.delete("/:id", requireAuth, expenseController.deleteExpense);

router.post(
  "/process/:emailId",
  requireAuth,
  expenseController.processExpense
);

export default router;
