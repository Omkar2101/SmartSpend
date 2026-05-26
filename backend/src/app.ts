// Application setup and configuration
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "SmartSpend Backend Running"
  });
});

export default app;