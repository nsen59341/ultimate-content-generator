
export enum WorkflowState {
  INPUT = 'INPUT',
  FETCHING = 'FETCHING',
  DASHBOARD = 'DASHBOARD',
  GENERATING = 'GENERATING'
}

export enum Platform {
  LinkedIn = 'LinkedIn',
  InstagramPost = 'Instagram Post',
  InstagramReel = 'Instagram Reel',
  Facebook = 'Facebook',
  TweetThread = 'Tweet Thread',
  Email = 'Email Newsletter',
  Image = 'Image',
  Video = 'Video'
}

export interface ContentCardData {
  title: string;
  duration?: string;
  readTime?: string;
  summary: string;
  type: 'YouTube' | 'Blog';
}

export interface GenerationResult {
  platform: Platform;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}
