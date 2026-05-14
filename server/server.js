import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

const app = express();

/* -------- DATABASE -------- */

connectDB();

/* -------- MIDDLEWARE -------- */

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://jarvis-ai-chatbot-delta.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

/* -------- ROUTES -------- */

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/conversations", conversationRoutes);

app.get("/", (req, res) => {
  res.send("Jarvis API is running");
});

/* -------- SERVER -------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});