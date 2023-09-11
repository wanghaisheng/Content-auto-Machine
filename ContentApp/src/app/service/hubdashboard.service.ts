/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject, concat, concatMap } from 'rxjs';
import { ContentRepository } from '../repository/content.repo';
import { Content } from '../model/content/content.model';
import { AdminRepository } from '../repository/admin.repo';
import { Generators } from '../model/admin/generators.model';
import { ZoomRepository } from '../repository/apis/zoom.repo';
import { Meeting } from '../model/source/zoomrecordings.model';

@Injectable({
  providedIn: 'root',
})
export class HubDashboardService {

  private createLoadingSubject = new Subject<boolean>();
  creteLoadingObservable$ = this.createLoadingSubject.asObservable();

  private contentLoadingSubject = new Subject<boolean>();
  contentLoadingObservable$ = this.contentLoadingSubject.asObservable();
  
  private errorSubject = new Subject<string>();
  errorObservable$ = this.errorSubject.asObservable();

  private generatorsListSubject = new Subject<{
    header: string;
    items: {
      type: string;
      title: string;
      description: string;
      prompt: string;
    }[];
  }[]>();
  generatorsListObservable$: Observable<{
    header: string;
    items: {
      type: string;
      title: string;
      description: string;
      prompt: string;
    }[];
  }[]> = this.generatorsListSubject.asObservable();

  private contentSubject = new Subject<Content>();
  contentObservable$: Observable<Content> = this.contentSubject.asObservable();

  private meetingsSubject = new Subject<Meeting[]>();
  meetingsObservable$ = this.meetingsSubject.asObservable();

  constructor(
    private adminRepo: AdminRepository,
    private contentRepo: ContentRepository,
    private zoomRepo: ZoomRepository
  ) {
    /** */
  }

  getHubGenerators() {
    this.adminRepo.getGenerators().subscribe({
      next: (response: Generators) => {
        this.generatorsListSubject.next(this.toList(response));
      },
      error: (error: any) => {
        console.log("🔥 ~ file: hubdashboard.service.ts:40 ~ HubDashboardService ~ this.adminRepo.getGenerators ~ error:", error)
      }
    })
  }

  createZoomContent(
    title: string,
    zoomMeetingId: number,
    aiModel: string,
    contentType: string
  ) {
    this.contentLoadingSubject.next(true);
    this.zoomRepo.getContentFromMeeting(
      title,
      zoomMeetingId,
      aiModel,
      contentType
    ).subscribe({
      next: (response: Content) => {
        this.contentLoadingSubject.next(false);
        this.contentSubject.next(response);
      },
      error: (error: any) => {
        this.contentLoadingSubject.next(false);
        console.log("🔥 ~ file: hubdashboard.service.ts:62 ~ HubDashboardService ~ error:", error)
        this.errorSubject.next(error);
      }
    })
  }

  createYoutubeContent(
    title: string,
    youtubeUrl: string,
    aiModel: string
  ) {
    let trimmedUrl = youtubeUrl.split('v=')[1];

    this.contentRepo.getContentFromVideo(
      title,
      trimmedUrl, 
      aiModel
    ).subscribe({
      next: (response: Content) => {
        this.contentSubject.next(response);
      },
      error: (error: any) => {
        console.log("🔥 ~ file: hubdashboard.service.ts:62 ~ HubDashboardService ~ error:", error)
        this.errorSubject.next(error);
      }
    })
  }

  toList(generators: Generators) {
    const resultList: {
      header: string;
      items: {
        type: string;
        title: string;
        description: string;
        prompt: string;
      }[];
    }[] = [];
  
    for (const key in generators) {
      const resultItem: {
        header: string;
        items: {
          type: string;
          title: string;
          description: string;
          prompt: string;
        }[];
      } = {
        'header': '', 
        'items': []
      };

      if (generators.hasOwnProperty(key)) {
        const innerKeys = Object.keys(generators[key]);
        innerKeys.map((innerKey) => {
          if (innerKey === 'meta') {
            resultItem['header'] = generators[key][innerKey]['title'];
          } else {
            resultItem['items'].push({
              'type': innerKey,
              ...generators[key][innerKey]
            })
          }
        });
        resultList.push(resultItem);
      }
    }
    return resultList;
  }

  getZoomMeetings() {
    this.createLoadingSubject.next(true);
    this.zoomRepo.getZoomMeetings().subscribe({
      next: (response) => {
        this.createLoadingSubject.next(false);
        this.meetingsSubject.next(response)
      },
      error: (error) => {
        this.createLoadingSubject.next(false);
        this.errorSubject.next(error.message)
      }
    })
  }
}
