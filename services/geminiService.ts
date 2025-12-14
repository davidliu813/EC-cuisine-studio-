
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { MenuItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate a creative description
export const generateMenuDescription = async (dishName: string, ingredients: string): Promise<string> => {
  if (!apiKey) return "Freshly prepared with quality ingredients.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, appetizing, mouth-watering menu description (max 2 sentences) for a dish named "${dishName}" containing these ingredients: ${ingredients}.`,
    });
    return response.text?.trim() || "Delicious dish prepared with fresh ingredients.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Freshly prepared with quality ingredients.";
  }
};

// Helper to analyze sales
export const analyzeDailySales = async (salesData: any[], popularItems: string[]): Promise<string> => {
  if (!apiKey) return "Good job on today's sales! Keep monitoring the lunch rush for better staff allocation.";

  try {
    const prompt = `
      You are a restaurant manager assistant. Analyze this sales data:
      ${JSON.stringify(salesData)}
      Popular Items: ${popularItems.join(', ')}
      
      Give me ONE concise, actionable, and encouraging business tip (max 30 words) based on this data. 
      Focus on revenue peaks or staffing.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "Sales look good! Consider adding a special for the afternoon slump.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time.";
  }
};

// Helper to suggest a price
export const suggestPrice = async (dishName: string, category: string): Promise<number> => {
  if (!apiKey) return 0;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Suggest a reasonable price (number only) for a standard restaurant ${category} dish named "${dishName}". Return just the number, no currency symbol.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER }
          }
        }
      }
    });
    
    const text = response.text;
    if (text) {
       const json = JSON.parse(text);
       return json.price || 15;
    }
    return 15;
  } catch (error) {
    return 12;
  }
};

// Helper to edit image (simulate background removal/clean up)
export const editDishImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    // Note: 'gemini-2.5-flash-image' is used for editing/generation
    // In a real scenario, we might use a specific mask, but here we ask the model to regenerate the scene.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: prompt // e.g., "Isolate this dish on a pure white background"
          }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data; // Returns base64 string
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    return null;
  }
};

// Helper to generate audio description (TTS)
export const generateDishAudio = async (text: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, warm voice for food
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};
