import { ExpenseProducer } from "../../producers/expense.producer";

export class ExpenseService {
  private expenseProducer = new ExpenseProducer();

  async enqueueExpenseProcessing(emailMessageId: string, userId: string) {
    await this.expenseProducer.publish(emailMessageId, userId);

    return {
      message: "Expense processing started",
    };
  }
}
