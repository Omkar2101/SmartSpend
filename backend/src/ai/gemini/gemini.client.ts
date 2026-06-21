import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

console.log("gemini",process.env.GEMINI_API_KEY);
export const geminiModel = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


