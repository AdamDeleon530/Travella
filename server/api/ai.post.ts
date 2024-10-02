import OpenAI from "openai";
import { Prompt } from "../data/travel_prompt";
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

async function callAI(prompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: Prompt,
      },
      { role: "user", content: prompt },
    ],
  });
  return response.choices[0].message.content;
}

export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event);
  let response = await callAI(prompt);
  return response;
});
