import Memory from "../models/Memory.js";

export const saveMemory = async (
  userId,
  key,
  value
) => {
  await Memory.findOneAndUpdate(
    {
      userId,
      key,
    },
    {
      value,
    },
    {
      upsert: true,
      new: true,
    }
  );
};

export const extractAndSaveMemory = async (
  userId,
  message
) => {
  const lowerMessage = message.toLowerCase();

  // Favorite language
  if (lowerMessage.includes("favorite language")) {
    const language = message.split("is")[1]?.trim();

    if (language) {
      await saveMemory(
        userId,
        "favorite_language",
        language
      );
    }
  }

  // Name
  if (lowerMessage.includes("my name is")) {
    const name = message.split("is")[1]?.trim();

    if (name) {
      await saveMemory(userId, "name", name);
    }
  }
};