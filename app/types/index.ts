export interface Comment {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export interface LiveStream {
  id: string;
  youtube_url: string;
  title: string;
  is_active: boolean;
  viewerCount?: number;
} 