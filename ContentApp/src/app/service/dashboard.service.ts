import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { FireAuthRepository } from '../repository/firebase/fireauth.repo';
import { Observable, Subject, concat, concatMap } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { ContentRepository } from '../repository/content.repo';
import { EventColor } from 'calendar-utils';
import { ContentComplete } from '../model/contentcomplete.model';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  
  private errorSubject = new Subject<string>();
  errorObservable$ = this.errorSubject.asObservable();

  private contentCompleteSubject = new Subject<ContentComplete>()
  contentCompleteObservable$: Observable<ContentComplete> = this.contentCompleteSubject.asObservable();

  constructor(
    private contentRepo: ContentRepository
  ) {
    /** */
  }

  createContent(
    youtubelink: string,
    ai_model: string
  ) {
    //temporary
    this.contentCompleteSubject.next({
      content: 'here is our sample content'
    })
  }
}
