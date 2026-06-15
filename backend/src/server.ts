// Server initialization and startup
import dotenv from "dotenv";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startExpenseConsumer } from "./consumers/expense.consumer";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer =
    async () => {

        await connectRabbitMQ();

        await startExpenseConsumer();

        app.listen(PORT, () => {

            console.log(
                `Server running on ${PORT}`
            );

        });

    };

startServer();