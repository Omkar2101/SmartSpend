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

      //as we are getting the user from Auth so we have its clerkId in our req
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
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to enqueue expense processing",
      });
    }
  };
}
