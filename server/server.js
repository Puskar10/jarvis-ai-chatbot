import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

/* -------- DATABASE -------- */

connectDB();

/* -------- MIDDLEWARE -------- */

app.use(cors());

app.use(express.json());

/* -------- ROUTES -------- */

app.use("/chat", chatRoutes);

/* -------- SERVER -------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});