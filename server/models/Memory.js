const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    userId: String,
    key: String,
    value: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memory", memorySchema);