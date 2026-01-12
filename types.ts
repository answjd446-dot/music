
export interface Song {
  title: string;
  artist: string;
  isKorean: boolean;
  reason: string;
  youtubeLink: string;
  coverImageUrl: string; // 앨범 커버 이미지 URL 추가
}

export interface RecommendationResponse {
  songs: Song[];
  dailyMessage: string;
}
