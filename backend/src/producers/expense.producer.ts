import { EXPENSE_QUEUE, getRabbitChannel } from "../config/rabbitmq";

export class ExpenseProducer {
  async publish(emailMessageId: string, userId: string) {
    const channel = getRabbitChannel();

    const payload = {
      emailMessageId,
      userId,
    };

    channel.sendToQueue(EXPENSE_QUEUE, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });

    console.log("job published", payload);
  }
}
