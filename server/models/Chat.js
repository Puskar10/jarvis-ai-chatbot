const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
    {
        userId: String,
        role: String,
        message: String,
    },
    {timestamps: true}
);
module.exports = mongoose.model("Chat", chatSchema);