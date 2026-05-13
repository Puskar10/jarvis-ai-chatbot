import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    userId: String,
    key: String,
    value: String,
  },
  { timestamps: true }
);

const Memory = mongoose.model("Memory", memorySchema);

export default Memory;