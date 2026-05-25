
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartBusinessInsight = async (
  weather: string,
  currentOrders: number,
  rushHour: boolean
): Promise<string> => {
  try {
    // Updated to gemini-3-flash-preview for basic text tasks (e.g. business tips)
    const modelId = 'gemini-3-flash-preview'; 
    const prompt = `
      You are a smart restaurant assistant for the "Crevings" partner app.
      Context:
      - Current Weather: ${weather}
      - Orders Today: ${currentOrders}
      - Rush Hour Mode: ${rushHour ? 'Active' : 'Inactive'}

      Provide a single, short, actionable, and encouraging business tip (max 2 sentences) for the restaurant manager to optimize their day. 
      Focus on staffing, inventory, or customer satisfaction.
      Do not use markdown. Just plain text.
    `;

    // Always use response.text directly (property access) for standard content generation.
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Keep up the great work! Monitor your inventory levels closely.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Optimize your preparation times to handle peak hours efficiently.";
  }
};
