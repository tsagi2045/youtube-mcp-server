export interface VideoStats {
  views: number;
  likes: number;
  comments: number;
  favorites: number;
}

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: any;
  channelId: string;
  channelTitle: string;
  tags?: string[];
  duration: string;
  statistics: VideoStats;
}