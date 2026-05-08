import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateAIResponse = async (
  chats,
  memoryText
) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [
      {
        role: "system",
        content: `
You are Jarvis, a smart AI assistant.

User Memories:
${memoryText}

Use memories naturally in conversation.
        `,
      },

      ...chats.map((chat) => ({
        role: chat.role,
        content: chat.message,
      })),
    ],
  });

  return response.choices[0].message.content;
};