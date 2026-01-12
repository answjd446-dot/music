
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "../types";

export const fetchMusicRecommendations = async (theme: string): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `당신은 세계 최고의 음악 전문 AI 큐레이터입니다. 사용자의 요청 "${theme}"에 맞춰 7곡의 플레이리스트를 생성하세요.

핵심 지시 사항:
1. **아티스트 일치**: 특정 아티스트 언급 시, 모든 노래(7곡)를 반드시 해당 아티스트의 실제 곡으로 구성하세요.
2. **재생 가능한 링크 (중요)**: 
   - 사용자가 클릭했을 때 "볼 수 없는 동영상"이 뜨지 않도록, 특정 비디오 ID로 직접 연결하지 마세요.
   - 대신, 가장 정확한 검색 결과를 보장하는 유튜브 검색 링크를 생성하세요.
   - 형식: "https://www.youtube.com/results?search_query=[아티스트]+[곡제목]+Official+Audio"
   - 검색어에 'Official Audio' 또는 'Official MV'를 포함하여 공식 채널 영상이 최상단에 나오도록 유도하세요.
3. **앨범 아트**: 
   - 'coverImageUrl'은 "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"와 같이 음악적 분위기에 어울리는 고해상도 추상 이미지 혹은 해당 장르/아티스트의 느낌을 주는 placeholder 이미지를 사용하거나, 실제 공식 이미지 경로를 추론하여 넣으세요.
4. **비율**: 한국 음악 5곡, 해외 음악 2곡 비율을 유지하세요.
5. **결과 언어**: 'reason'과 'dailyMessage'는 한국어로 매우 감성적이고 MZ스러운 전문적인 톤으로 작성하세요.

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
    const data = JSON.parse(response.text.trim());
    // 한 번 더 서버 측에서 링크 검증 및 보강 (공백 처리 등)
    data.songs = data.songs.map((song: any) => ({
      ...song,
      youtubeLink: song.youtubeLink.includes('search_query') 
        ? song.youtubeLink 
        : `https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + " " + song.title + " Official Audio")}`
    }));
    return data;
  } catch (e) {
    throw new Error("음악 데이터를 불러오는 중 오류가 발생했습니다.");
  }
};
