import { ExpenseProducer } from "../../producers/expense.producer";
import { InvoiceRepository } from "../invoice/invoice.repository";
import { UserRepository } from "../user/user.repository";

export class ExpenseService {
  private expenseProducer = new ExpenseProducer();
  private invoiceRepository = new InvoiceRepository();
  private userRepository = new UserRepository();

  private async getInternalUserId(clerkId: string): Promise<string> {
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.id;
  }

  async enqueueExpenseProcessing(emailMessageId: string, clerkId: string) {
    await this.expenseProducer.publish(emailMessageId, clerkId);
    return {
      message: "Expense processing started",
    };
  }

  async listExpenses(
    clerkId: string,
    filters: any,
    pagination: any
  ) {
    const userId = await this.getInternalUserId(clerkId);
    return this.invoiceRepository.findMany(userId, filters, pagination);
  }

  async getExpenseDetails(id: string, clerkId: string) {
    const userId = await this.getInternalUserId(clerkId);
    const invoice = await this.invoiceRepository.findById(id, userId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return invoice;
  }

  async createExpense(
    clerkId: string,
    data: {
      vendor: string;
      totalAmount: number;
      currency?: string;
      category?: string;
      invoiceDate?: string;
      invoiceNumber?: string;
      rawText?: string;
    }
  ) {
    const userId = await this.getInternalUserId(clerkId);
    return this.invoiceRepository.createInvoice({
      userId,
      vendor: data.vendor,
      amount: data.totalAmount,
      currency: data.currency || "INR",
      category: data.category || "Uncategorized",
      expenseDate: data.invoiceDate,
    });
  }

  async updateExpense(
    id: string,
    clerkId: string,
    data: any
  ) {
    const userId = await this.getInternalUserId(clerkId);
    const invoice = await this.invoiceRepository.update(id, userId, data);
    if (!invoice) {
      throw new Error("Invoice not found or not owned by user");
    }
    return invoice;
  }

  async deleteExpense(id: string, clerkId: string) {
    const userId = await this.getInternalUserId(clerkId);
    const result = await this.invoiceRepository.delete(id, userId);
    if (result.count === 0) {
      throw new Error("Invoice not found or not owned by user");
    }
    return { success: true };
  }

  async getExpenseStats(clerkId: string) {
    const userId = await this.getInternalUserId(clerkId);
    return this.invoiceRepository.getStats(userId);
  }
}
