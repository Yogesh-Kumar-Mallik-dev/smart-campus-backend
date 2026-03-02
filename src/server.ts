import dotenv from "dotenv";
import app from "@/app";
import { connectDB } from "@/config/db";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8595;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in environment variables");
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    const shutdown = () => {
      console.log("Shutting down server...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

void startServer();