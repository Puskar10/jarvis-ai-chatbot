import express from "express";

import {
  getUserConversations,
  getConversationMessages,
  deleteConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

// Get all conversations of one user
router.get("/user/:userId", getUserConversations);

// Get all messages of one conversation
router.get("/:conversationId/messages", getConversationMessages);

// Delete one conversation
router.delete("/:conversationId", deleteConversation);

export default router;