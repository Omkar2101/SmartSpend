import { geminiModel } from "./gemini.client";
import { buildExpensePrompt } from "./prompts";
import { ExpenseSchema } from "./schemas";

interface EmailData {
  subject?: string;
  sender?: string;
  snippet?: string;
}

export const extractExpense = async (email: EmailData) => {
  const prompt = buildExpensePrompt(email);

  const result = await geminiModel.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
  });
  console.log("Gemini Response:", result.text);

  const responseText = result.text;

  console.log("Gemini Raw Response:", responseText);

  /**
   * Gemini sometimes wraps JSON
   * inside ```json blocks
   */
  const cleanedResponse = responseText
    ?.replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsedResponse = JSON.parse(cleanedResponse!);

  return ExpenseSchema.parse(parsedResponse);
};
