import { ProcessingStatus } from "@prisma/client";

import { EmailRepository } from "../modules/email/email.repository";
import { InvoiceRepository } from "../modules/invoice/invoice.repository";
import { UserRepository } from "../modules/user/user.repository";
import { NotificationRepository } from "../modules/notification/notification.repository";

import { extractExpense } from "../ai/gemini/expense-extractor";

export class ExpenseProcessingWorker {
  private emailRepository = new EmailRepository();

  private invoiceRepository = new InvoiceRepository();

  private notificationRepository = new NotificationRepository();

  private userRepository = new UserRepository();

  async process(emailMessageId: string, userId: string) {
    try {
      // STEP 1: Update the email message status to PROCESSING to prevent duplicate runs
      await this.emailRepository.updateProcessingStatus(
        emailMessageId,
        ProcessingStatus.PROCESSING,
      );

      // STEP 2: Find the email message details by its Gmail Message ID
      const email =
        await this.emailRepository.findByGmailMessageId(emailMessageId);

      const user = await this.userRepository.findByClerkId(userId);

      if (!email) {
        throw new Error("Email not found");
      }

      if (!user) {
        throw new Error("User not found");
      }

      // STEP 3: Extract structured expense details using Gemini AI
      const extraction = await extractExpense({
        subject: email.subject ?? undefined,

        sender: email.sender ?? undefined,

        snippet: email.snippet ?? undefined,
      });

      // STEP 4: Create a new invoice record based on the AI extraction results
      const invoice = await this.invoiceRepository.createInvoice({
        userId: user.id,

        emailMessageId,

        vendor: extraction.vendor,

        amount: extraction.amount,

        currency: extraction.currency,

        category: extraction.category,

        confidence: extraction.confidence,

        expenseDate: extraction.expenseDate,
      });

      // STEP 5: Create a notification for the user to alert them of the newly processed expense
      await this.notificationRepository.createNotification(
        user.id,

        "Expense Processed",

        `${extraction.vendor} purchase of ₹${extraction.amount} added to ${extraction.category} category.`,
      );

      // STEP 6: Update the email status to PROCESSED once everything succeeds
      await this.emailRepository.updateProcessingStatus(
        emailMessageId,
        ProcessingStatus.PROCESSED,
      );

      return invoice;
    } catch (error) {
      // STEP 7: If any error occurs, update the email status to FAILED
      await this.emailRepository.updateProcessingStatus(
        emailMessageId,
        ProcessingStatus.FAILED,
      );

      throw error;
    }
  }
}
