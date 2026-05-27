import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Order } from '../types';

let chatSession: Chat | null = null;

const initializeChat = (allOrders: Order[]) => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const ordersContext = JSON.stringify(allOrders);

  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a helpful, friendly AI customer support agent for a food delivery app called 'Crevings'. 
      You have access to the user's order history data provided here: ${ordersContext}.
      
      Your goal is to assist users with:
      1. Checking the status of active orders.
      2. Providing details about past orders.
      3. Suggesting reorders based on high ratings (>= 4.5).
      4. Handling complaints about cancelled orders politely.

      Keep responses concise (under 50 words unless detailed explanation is needed).
      Use emojis occasionally to be friendly.
      If the user asks about something not in the order history, politely decline or give a general answer.
      `,
    },
  });
  return chatSession;
};

export const sendMessageToAI = async (message: string, allOrders: Order[]): Promise<string> => {
  try {
    const chat = initializeChat(allOrders);
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I'm having trouble connecting to the kitchen right now. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm currently experiencing high traffic. Please try again later.";
  }
};

export const sendMessageToOrderAI = async (message: string, order: Order, progress: number, timeLeft: number): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const orderContext = JSON.stringify({
      ...order,
      currentProgress: progress,
      estimatedTimeLeftSeconds: timeLeft,
      deliveryPartner: order.type === 'Delivery' ? { name: 'Ramesh Kumar', rating: 4.8, phone: '+91 9876543210' } : null
    });

    const chat = ai.chats.create({
      model: 'gemini-3.1-flash-preview',
      config: {
        systemInstruction: `You are a helpful, friendly AI customer support agent for a food delivery app called 'Crevings'. 
        You are currently assisting a user with a specific active order.
        Here is the real-time data for this order: ${orderContext}.
        
        Your goal is to assist the user with:
        1. Checking the real-time status of this specific order.
        2. Providing details about the delivery partner if applicable.
        3. Answering any questions about the items in this order.

        Keep responses concise (under 50 words unless detailed explanation is needed).
        Use emojis occasionally to be friendly.
        If the user asks about something not related to this order, politely guide them back to the order details.
        `,
      },
    });
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I'm having trouble connecting to the kitchen right now. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm currently experiencing high traffic. Please try again later.";
  }
};