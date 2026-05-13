import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: String,
    role: String,
    message: String,
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;