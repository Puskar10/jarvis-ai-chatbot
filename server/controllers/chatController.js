import Chat from "../models/Chat.js";
import Memory from "../models/Memory.js";

import { generateAIResponse } from "../services/aiService.js";

import { extractAndSaveMemory } from "../services/memoryService.js";

export const chatHandler = async (req, res) => {
  try {
    const { userId, message } = req.body;

    console.log("BODY:", req.body);

    /* -------- SAVE USER MESSAGE -------- */

    await Chat.create({
      userId,
      role: "user",
      message,
    });

    /* -------- GET CHAT HISTORY -------- */

    const chats = await Chat.find({ userId })
      .sort({ createdAt: 1 })
      .limit(20);

    /* -------- GET MEMORIES -------- */

    const memories = await Memory.find({ userId });

    const memoryText = memories
      .map((m) => `${m.key}: ${m.value}`)
      .join("\n");

    /* -------- AI RESPONSE -------- */

    const aiReply = await generateAIResponse(
      chats,
      memoryText
    );

    /* -------- SAVE AI MESSAGE -------- */

    await Chat.create({
      userId,
      role: "assistant",
      message: aiReply,
    });

    /* -------- MEMORY EXTRACTION -------- */

    await extractAndSaveMemory(userId, message);

    /* -------- RESPONSE -------- */

    res.json({
      reply: aiReply,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};