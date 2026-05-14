import Conversation from "../models/Conversation.js";
import Chat from "../models/Chat.js";

/* -------- GET ALL CONVERSATIONS OF A USER -------- */

export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({ userId }).sort({
      updatedAt: -1,
    });

    res.json(conversations);
  } catch (error) {
    console.log("GET CONVERSATIONS ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};

/* -------- GET MESSAGES OF ONE CONVERSATION -------- */

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Chat.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    console.log("GET MESSAGES ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};

/* -------- DELETE CONVERSATION -------- */

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Chat.deleteMany({ conversationId });

    await Conversation.findByIdAndDelete(conversationId);

    res.json({
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.log("DELETE CONVERSATION ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};