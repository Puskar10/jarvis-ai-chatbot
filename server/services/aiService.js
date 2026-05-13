import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateAIResponse = async (messages, memoryText) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [
      {
        role: "system",
        content: `
You are a helpful AI assistant named Jarvis.

Important rules:
- Do NOT roleplay as Iron Man's Jarvis.
- Do NOT mention Stark, Tony Stark, systems check, missions, or fictional events.
- Do NOT invent past conversations.
- Only use saved memories if they are clearly listed below.
- If the user says "hi" or "how are you", reply normally and briefly.
- If there are no useful memories, ignore the memory section.
- Never pretend to remember something unless it appears in saved memories.

Saved user memories:
${memoryText}
        `,
      },

      ...messages,
    ],

    temperature: 0.3,
  });

  return response.choices[0].message.content;
};