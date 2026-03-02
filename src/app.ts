import express from "express";
import {Application} from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "@/routes/auth.routes";

const app : Application = express();

app.use(
    cors({
      origin: "process.env.FRONTEND_URL",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    })
);

app.use(express.json());


app.get("/", (_, res) => {
  res.redirect(process.env.FRONTEND_URL as string);
});

app.use("/api/auth", authRoutes);


export default app;