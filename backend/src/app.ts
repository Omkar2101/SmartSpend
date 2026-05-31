// Application setup and configuration
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import prisma from "./config/prisma";
import { errorHandler } from "./errors/errorHandler";
import apiRoutes from "./routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", apiRoutes);
app.use(errorHandler);

app.get("/health", async (_, res) => {
  const userCount = await prisma.user.count();

  res.json({
    success: true,
    message: "SmartSpend Backend Running",
    users: userCount,
  });
});

export default app;