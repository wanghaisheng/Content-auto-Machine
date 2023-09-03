import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { FireAuthRepository } from '../repository/database/fireauth.repo';
import { Observable, Subject, concat, concatMap } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { ContentRepository } from '../repository/content.repo';
import { EventColor } from 'calendar-utils';
import { ContentComplete } from '../model/contentcomplete.model';
import { VideoRepository } from '../repository/sources/video.repo';
import { YoutubeTranscript } from '../model/youtubetranscript.model';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  
  private errorSubject = new Subject<string>();
  errorObservable$ = this.errorSubject.asObservable();

  private contentCompleteSubject = new Subject<ContentComplete>();
  contentCompleteObservable$: Observable<ContentComplete> = this.contentCompleteSubject.asObservable();

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

    this.videoRepo.getSampleCompletion().subscribe((response: string) => {
      this.contentCompleteSubject.next({
        content: response
      });
    });
    this.videoRepo.getYoutubeTranscript(
      trimmedUrl, 
      aiModel
    ).subscribe((transcript: YoutubeTranscript) => {
      this.contentCompleteSubject.next({
        content: `Transcript: ${transcript.completeText} from ${transcript.userUuid} with video ${transcript.videoUuid}}`,
      });
    })
  }
}
