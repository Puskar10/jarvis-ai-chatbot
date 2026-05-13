import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

//console.log(process.env.GROQ_API_KEY);
// console.log(process.env.MONGO_URI);

/* -------- DATABASE -------- */

connectDB();

/* -------- MIDDLEWARE -------- */

app.use(cors());

app.use(express.json());

/* -------- ROUTES -------- */
app.use("/auth",authRoutes);
app.use("/chat", chatRoutes);



app.get("/", (req, res) => {
  res.send("Jarvis API is running");
});

/* -------- SERVER -------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});