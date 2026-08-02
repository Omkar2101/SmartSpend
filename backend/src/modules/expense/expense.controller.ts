import { Request, Response } from "express";
import { ExpenseService } from "./expense.service";

export class ExpenseController {
  private expenseService = new ExpenseService();

  processExpense = async (req: Request, res: Response) => {
    try {
      const emailMessageId = req.params.emailId;

      if (typeof emailMessageId !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid emailId parameter",
        });
        return;
      }

      const userId = req.user!.clerkId;

      const result = await this.expenseService.enqueueExpenseProcessing(
        emailMessageId,
        userId,
      );

      res.status(202).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error enqueuing expense:", error);

      res.status(500).json({
        success: false,
        message: "Failed to enqueue expense processing",
      });
    }
  };

  listExpenses = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const filters = {
        category: req.query.category as string,
        vendor: req.query.vendor as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        currency: req.query.currency as string,
      };
      const pagination = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      };

      const expenses = await this.expenseService.listExpenses(clerkId, filters, pagination);
      res.json({
        success: true,
        data: expenses,
      });
    } catch (error) {
      console.error("Error listing expenses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch expenses",
      });
    }
  };

  getExpenseDetails = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const id = req.params.id as string;

      const expense = await this.expenseService.getExpenseDetails(id, clerkId);
      res.json({
        success: true,
        data: expense,
      });
    } catch (error: any) {
      console.error("Error fetching expense details:", error);
      const status = error.message === "Invoice not found" ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to fetch expense details",
      });
    }
  };

  createExpense = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const expense = await this.expenseService.createExpense(clerkId, req.body);
      res.status(201).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create expense",
      });
    }
  };

  updateExpense = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const id = req.params.id as string;
      const expense = await this.expenseService.updateExpense(id, clerkId, req.body);
      res.json({
        success: true,
        data: expense,
      });
    } catch (error: any) {
      console.error("Error updating expense:", error);
      const status = error.message.includes("not found") ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to update expense",
      });
    }
  };

  deleteExpense = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const id = req.params.id as string;
      await this.expenseService.deleteExpense(id, clerkId);
      res.json({
        success: true,
        message: "Expense deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      const status = error.message.includes("not found") ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to delete expense",
      });
    }
  };

  getExpenseStats = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const stats = await this.expenseService.getExpenseStats(clerkId);
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error fetching expense stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch stats",
      });
    }
  };
}
