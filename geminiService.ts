
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "./types";

const API_KEY = process.env.API_KEY || "";

export const fetchMusicRecommendations = async (theme: string): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Based on the theme/genre "${theme}", recommend 7 songs for a commute (subway or bus). 
  Requirements:
  1. Exactly 5 songs should be Korean (K-Pop, K-Indie, K-Ballad, etc.) and 2 songs should be International (Global Pop, Rock, etc.).
  2. Provide a search-friendly YouTube link for each song in the format: https://www.youtube.com/results?search_query=Artist+-+Song+Title
  3. Provide a brief reason why it fits the commute.
  4. Language of the response text (reason and dailyMessage) must be Korean.`;

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

  return JSON.parse(response.text);
};
