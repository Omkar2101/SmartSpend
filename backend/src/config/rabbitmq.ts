import amqp from "amqplib";

const RABBITMQ_URL =
    process.env.RABBITMQ_URL ||
    "amqp://guest:guest@localhost:5672";

export const EXPENSE_QUEUE =
    "expense-processing";

let channel: amqp.Channel;
//add comments 

export const connectRabbitMQ =
    async () => {
        const connection =
            await amqp.connect(
                RABBITMQ_URL
            );

        channel =
            await connection.createChannel();

        await channel.assertQueue(
            EXPENSE_QUEUE,
            {
                durable: true,
            }
        );

        console.log(
            "RabbitMQ connected"
        );

    };

export const getRabbitChannel =
    () => {

        if (!channel) {

            throw new Error(
                "RabbitMQ not initialized"
            );

        }

        return channel;

    };