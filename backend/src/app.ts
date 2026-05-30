// Application setup and configuration
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import prisma from "./config/prisma";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());

app.get("/health", async (_, res) => {
  const userCount = await prisma.user.count();

  res.json({
    success: true,
    message: "SmartSpend Backend Running",
    users: userCount,
  });
});

export default app;