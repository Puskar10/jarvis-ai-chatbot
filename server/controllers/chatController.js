import Chat from "../models/Chat.js";
import Memory from "../models/Memory.js";

import { generateAIResponse } from "../services/aiService.js";
import { extractAndSaveMemory } from "../services/memoryService.js";

export const chatHandler = async (req, res) => {
  try {
    const { userId, message } = req.body;

    /* -------- VALIDATION -------- */

    if (!userId || !message) {
      return res.status(400).json({
        error: "userId and message are required",
      });
    }

    console.log("BODY:", req.body);

    /* -------- MEMORY EXTRACTION FIRST -------- */
    // Save memory before AI response so Jarvis can use it immediately

    await extractAndSaveMemory(userId, message);

    /* -------- SAVE USER MESSAGE -------- */

    await Chat.create({
      userId,
      role: "user",
      message,
    });

    /* -------- GET CHAT HISTORY -------- */

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedChats = chats
      .reverse()
      .map((chat) => ({
        role: chat.role,
        content: chat.message,
      }));

    /* -------- GET MEMORIES -------- */

    const memories = await Memory.find({ userId });

    const memoryText =
      memories.length > 0
        ? memories.map((m) => `${m.key}: ${m.value}`).join("\n")
        : "No saved memories yet.";

    /* -------- AI RESPONSE -------- */

    const aiReply = await generateAIResponse(
      formattedChats,
      memoryText
    );

    /* -------- SAVE AI MESSAGE -------- */

    await Chat.create({
      userId,
      role: "assistant",
      message: aiReply,
    });

    /* -------- RESPONSE -------- */

    res.json({
      reply: aiReply,
    });
  } catch (error) {
    console.log("CHAT ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};