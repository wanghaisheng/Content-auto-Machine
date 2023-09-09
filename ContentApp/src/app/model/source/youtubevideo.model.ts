/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelTitle: string;
  statistics: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
      dislikeCount?: string;
      favoriteCount?: string;
  };
  channelId?: string;
  duration?: string;
  tags?: string[];
  category?: string;
  liveBroadcastContent?: string;
  defaultAudioLanguage?: string;
  defaultLanguage?: string;
  localized?: {
      title: string;
      description: string;
  };
  defaultThumbnail?: string;
}
