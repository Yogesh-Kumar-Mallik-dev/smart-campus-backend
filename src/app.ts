import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import { requestIdMiddleware } from "@/middlewares/requestId.middleware";
import { logger } from "@/middlewares/logger.middleware";
import { errorLogger } from "@/middlewares/errorLogger.middleware";

/* ================= ENV ================= */

dotenv.config();

/* ================= ROUTE IMPORTS ================= */

import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";
import announcementRoutes from "@/routes/announcement.routes";
import notificationRoutes from "@/routes/notification.routes";

/* ================= APP INIT ================= */

const app: Application = express();

/* ================= SECURITY ================= */

app.use(helmet());

/* ================= REQUEST ID ================= */

app.use(requestIdMiddleware);

/* ================= HTTP LOGGER ================= */

app.use(logger);

/* ================= CORS ================= */

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
].filter(Boolean);

app.use(
    cors({
      origin: (origin, callback) => {

        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
);

/* ================= BODY PARSER ================= */

app.use(express.json());

/* ================= HEALTH CHECK ================= */

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Smart Campus API running",
  });
});

/* ================= ROUTES ================= */

/* Auth */
app.use("/api/auth", authRoutes);

/* Users */
app.use("/api", userRoutes);

/* Announcements */
app.use("/api/announcements", announcementRoutes);

/* Notifications */
app.use("/api/notifications", notificationRoutes);

/* ================= ERROR LOGGER ================= */

app.use(errorLogger);

/* ================= GLOBAL ERROR HANDLER ================= */

app.use(
    (err: any, _req: Request, res: Response, _next: NextFunction) => {

      if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
          message: "CORS error",
        });
      }

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
);

/* ================= EXPORT ================= */

export default app;