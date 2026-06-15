import { EXPENSE_QUEUE, getRabbitChannel } from "../config/rabbitmq";

export const startExpenseConsumer = async () => {
  const channel = getRabbitChannel();

  channel.consume(
    EXPENSE_QUEUE,

    async (message) => {
      if (!message) {
        return;
      }

      const payload = JSON.parse(message.content.toString());

      console.log("Processing job:", payload);
      // ack tells rabbitmq that the message has been processed
      // if the consumer crashes, the message will be reprocessed
      channel.ack(message);
    },
  );

  console.log("Expense consumer started");
};
