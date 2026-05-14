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

/* -------- CORS -------- */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://jarvis-ai-chatbot-delta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Express 5 fix: don't use app.options("*", ...)
app.options("/{*splat}", cors());

app.use(express.json());

/* -------- ROUTES -------- */

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/conversations", conversationRoutes);

app.get("/", (req, res) => {
  res.send("Jarvis API is running");
});

/* -------- 404 HANDLER -------- */

// ✅ Express 5 wildcard route
app.all("/{*splat}", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* -------- SERVER -------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});