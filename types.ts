
export interface Song {
  title: string;
  artist: string;
  isKorean: boolean;
  reason: string;
  youtubeLink: string;
}

export interface RecommendationResponse {
  songs: Song[];
  dailyMessage: string;
}
