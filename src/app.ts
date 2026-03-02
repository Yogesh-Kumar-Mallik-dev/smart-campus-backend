import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import authRoutes from "@/routes/auth.routes";

const app: Application = express();

/* ================= SECURITY ================= */

app.use(helmet());
app.use(morgan("dev"));

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

/* ================= MIDDLEWARE ================= */

app.use(express.json());

/* ================= HEALTH CHECK ================= */

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Smart Campus API running" });
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);

/* ================= GLOBAL ERROR HANDLER ================= */

app.use(
    (
        err: any,
        _req: Request,
        res: Response,
        _next: NextFunction
    ) => {
      console.error(err);

      if (err.message === "Not allowed by CORS") {
        return res.status(403).json({ message: "CORS error" });
      }

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
);

export default app;