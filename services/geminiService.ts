
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "../types";

export const fetchMusicRecommendations = async (theme: string): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Based on the theme or genre "${theme}", suggest 7 songs suitable for a daily commute on public transport.
  Guidelines:
  - 5 songs MUST be Korean (70% ratio).
  - 2 songs MUST be International/Foreign (30% ratio).
  - Provide a search link for YouTube in the 'youtubeLink' field.
  - 'reason' should be a short one-sentence explanation in Korean for why it fits a commute.
  - 'dailyMessage' should be a welcoming greeting for the commute in Korean.
  - Return the data in strict JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          songs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                artist: { type: Type.STRING },
                isKorean: { type: Type.BOOLEAN },
                reason: { type: Type.STRING },
                youtubeLink: { type: Type.STRING }
              },
              required: ["title", "artist", "isKorean", "reason", "youtubeLink"]
            }
          },
          dailyMessage: { type: Type.STRING }
        },
        required: ["songs", "dailyMessage"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    throw new Error("Failed to parse music data");
  }
};
