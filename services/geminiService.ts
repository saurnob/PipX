
import { GoogleGenAI, Type } from "@google/genai";
import { ParsedSignal } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be caught by the App component and displayed to the user.
  // This check prevents the app from crashing if the API key is missing.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const parseSignalWithAI = async (signalText: string): Promise<ParsedSignal> => {
  if (!API_KEY) {
    return { 
      error: "Gemini API key is not configured. Please set the API_KEY environment variable.",
      coin: null, positionType: null, entryMin: null, entryMax: null, leverage: null, targets: null, stopLoss: null
    };
  }
  
  try {
    const prompt = `Extract the following information from the crypto signal text. Provide the output in JSON format.
- 'coin': The ticker symbol (e.g., BTC/USDT).
- 'positionType': Must be either 'SHORT' or 'LONG'.
- 'entryMin': The lower bound of the entry price range.
- 'entryMax': The upper bound of the entry price range.
- 'leverage': The recommended leverage as a number.
- 'targets': An array of target prices as numbers.
- 'stopLoss': The stop loss price as a number.

If any information is missing or unclear, set its value to null.

Signal Text:
${signalText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coin: { type: Type.STRING },
            positionType: { type: Type.STRING, enum: ['LONG', 'SHORT'] },
            entryMin: { type: Type.NUMBER },
            entryMax: { type: Type.NUMBER },
            leverage: { type: Type.INTEGER },
            targets: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER }
            },
            stopLoss: { type: Type.NUMBER }
          },
          required: ["coin", "positionType", "entryMin", "entryMax", "leverage", "targets", "stopLoss"]
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText) as ParsedSignal;
    return parsedJson;

  } catch (error: any) {
    console.error("Error parsing signal with AI:", error);
    let errorMessage = "AI parsing failed. Please check the signal format and try again.";
    if (error.message) {
        errorMessage = `AI parsing failed: ${error.message}. Please check signal format.`;
    }
    return {
      error: errorMessage,
      coin: null, positionType: null, entryMin: null, entryMax: null, leverage: null, targets: null, stopLoss: null
    };
  }
};
