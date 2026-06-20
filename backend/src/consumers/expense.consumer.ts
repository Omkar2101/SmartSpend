import { EXPENSE_QUEUE, getRabbitChannel } from "../config/rabbitmq";
import { emailRepository } from "../repositories/email.repository";
import { ProcessingStatus } from "@prisma/client";
import { extractExpense } from "../ai/gemini/expense-extractor";


export const startExpenseConsumer = async () => {
  const channel = getRabbitChannel();

  channel.consume(
    EXPENSE_QUEUE,
    async (message) => {
      if (!message) {
        return;
      }

      const payload = JSON.parse(message.content.toString());
      // console.log("Processing job:", payload);
      const { emailMessageId } = payload;

      try {
        // STEP 1
        await emailRepository.updateProcessingStatus(
          emailMessageId,
          ProcessingStatus.PROCESSING,
        );

        console.log(
          "📥 Processing job:",
          payload,
        );

        // STEP 2
        // Gemini processing
        

        // STEP 3
        await emailRepository.updateProcessingStatus(
          emailMessageId,
          ProcessingStatus.PROCESSED,
        );

        channel.ack(message);
      } catch (error) {
        console.error(error);

        await emailRepository.updateProcessingStatus(
          emailMessageId,
          ProcessingStatus.FAILED,
        );

        channel.ack(message);
      }
    },
  );

  console.log("Expense consumer started");
};


