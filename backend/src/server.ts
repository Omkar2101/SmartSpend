// Server initialization and startup
import dotenv from "dotenv";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startExpenseConsumer } from "./consumers/expense.consumer";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectRabbitMQ();
        await startExpenseConsumer();
    } catch (error) {
        console.warn("⚠️ RabbitMQ connection failed. Some background tasks (like email sync processing) may not work.", error);
    }

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
};


startServer();
