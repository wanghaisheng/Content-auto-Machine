/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { FireAuthRepository } from '../repository/database/fireauth.repo';
import { Observable, Subject, concat, concatMap } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { ContentRepository } from '../repository/content.repo';
import { EventColor } from 'calendar-utils';
import { ContentResponse } from '../model/contentresponse.model';
import { Content } from '../model/content.model';
import { VideoRepository } from '../repository/sources/video.repo';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  
  private errorSubject = new Subject<string>();
  errorObservable$ = this.errorSubject.asObservable();

  private contentSubject = new Subject<Content>();
  contentObservable$: Observable<Content> = this.contentSubject.asObservable();

  constructor(
    private videoRepo: VideoRepository
  ) {
    /** */
  }

  createContent(
    title: string,
    youtubeUrl: string,
    aiModel: string
  ) {
    let trimmedUrl = youtubeUrl.split('v=')[1];

    this.videoRepo.getContentFromVideo(
      title,
      trimmedUrl, 
      aiModel
    ).subscribe((response: ContentResponse) => {
      console.log("🚀 ~ file: dashboard.service.ts:41 ~ DashboardService ~ ).subscribe ~ response:", response)
      this.contentSubject.next(response.result);
    })
  }
}
