/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Thumbnail } from "./thumbnail.model";

export interface YoutubeInfo {
  title: string,
  description: string,
  lengthSeconds: number,
  videoId: string,
  viewCount: number,
  thumbnails: Thumbnail[],
}
