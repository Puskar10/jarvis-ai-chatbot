import Chat from "../models/Chat.js";
import Memory from "../models/Memory.js";
import Conversation from "../models/Conversation.js";

import { generateAIResponse } from "../services/aiService.js";
import { extractAndSaveMemory } from "../services/memoryService.js";

export const chatHandler = async (req, res) => {
  try {
    const { userId, message, conversationId } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        error: "userId and message are required",
      });
    }

    let activeConversationId = conversationId;

    // Create conversation if first message
    if (!activeConversationId) {
      const title =
        message.length > 30 ? message.slice(0, 30) + "..." : message;

      const conversation = await Conversation.create({
        userId,
        title,
      });

      activeConversationId = conversation._id;
    }

    // Save memory
    await extractAndSaveMemory(userId, message);

    // Save user message
    await Chat.create({
      userId,
      conversationId: activeConversationId,
      role: "user",
      message,
    });

    // Fetch only this conversation history
    const chats = await Chat.find({
      userId,
      conversationId: activeConversationId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedChats = chats.reverse().map((chat) => ({
      role: chat.role,
      content: chat.message,
    }));

    // Fetch memories
    const memories = await Memory.find({ userId });

    const memoryText =
      memories.length > 0
        ? memories.map((m) => `${m.key}: ${m.value}`).join("\n")
        : "No saved memories.";

    // Generate AI reply
    const aiReply = await generateAIResponse(formattedChats, memoryText);

    // Save AI reply
    await Chat.create({
      userId,
      conversationId: activeConversationId,
      role: "assistant",
      message: aiReply,
    });

    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(activeConversationId, {
      updatedAt: new Date(),
    });

    res.json({
      reply: aiReply,
      conversationId: activeConversationId,
    });
  } catch (error) {
    console.log("CHAT ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};