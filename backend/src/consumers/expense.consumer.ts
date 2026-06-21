import { EXPENSE_QUEUE, getRabbitChannel } from "../config/rabbitmq";
import { ExpenseProcessingWorker } from "../workers/expense-processing.worker";

const worker = new ExpenseProcessingWorker();

export const startExpenseConsumer = async () => {
  const channel = getRabbitChannel();

  channel.consume(EXPENSE_QUEUE, async (message) => {
    if (!message) {
      return;
    }

    const payload = JSON.parse(message.content.toString());
    const { emailMessageId, userId } = payload;

    try {
      console.log("📥 Processing job:", payload);

      // Delegate all extraction, database, and notification updates to the worker
      await worker.process(emailMessageId, userId);

      channel.ack(message);
    } catch (error) {
      console.error(`Failed to process expense for job ${emailMessageId}:`, error);
      
      // Acknowledge the message even on failure to avoid poison message loops, 
      // since the worker handles setting status to FAILED.
      channel.ack(message);
    }
  });

  console.log("Expense consumer started");
};
