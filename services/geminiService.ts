
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "../types";

export const fetchMusicRecommendations = async (theme: string): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `당신은 세계 최고의 음악 전문 AI 큐레이터입니다. 사용자의 요청 "${theme}"에 맞춰 7곡의 플레이리스트를 생성하세요.

핵심 지시 사항:
1. **아티스트 일치**: 특정 아티스트(예: 아이유) 언급 시, 모든 노래(7곡)를 반드시 해당 아티스트의 실제 앨범 수록곡으로만 구성하세요.
2. **고화질 앨범 커버 (필수)**: 
   - 유튜브 썸네일(hqdefault)이 아닌, 실제 음악 스트리밍 앱(Spotify 등)에서 볼 수 있는 정사각형 앨범 아트 이미지 URL을 생성하세요.
   - 만약 외부 URL 생성이 불가능하다면, 가장 고해상도인 유튜브 공식 뮤직 채널의 maxresdefault.jpg 형식을 사용하되 반드시 '정사각형'으로 크롭하여 보여줄 수 있도록 선별하세요.
   - 'coverImageUrl'은 "https://i.ytimg.com/vi/[VIDEO_ID]/maxresdefault.jpg" 형식을 기본으로 하되, 비디오 ID는 해당 곡의 'Official Audio' 또는 'Official MV'의 것을 사용하세요.
3. **비율**: 일반 장르 요청 시 한국 음악 5곡, 해외 음악 2곡 비율을 유지하세요.
4. **결과 언어**: 'reason'과 'dailyMessage'는 한국어로 매우 감성적이고 전문적인 톤으로 작성하세요.

JSON 형식으로 응답하십시오.`;

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
                youtubeLink: { type: Type.STRING },
                coverImageUrl: { type: Type.STRING }
              },
              required: ["title", "artist", "isKorean", "reason", "youtubeLink", "coverImageUrl"]
            }
          },
          dailyMessage: { type: Type.STRING }
        },
        required: ["songs", "dailyMessage"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    throw new Error("음악 데이터를 불러오는 중 오류가 발생했습니다.");
  }
};
