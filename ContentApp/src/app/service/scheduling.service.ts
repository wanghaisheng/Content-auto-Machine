/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable } from '@angular/core';
import { FireAuthRepository } from '../repository/database/fireauth.repo';
import { Observable, Subject, concat, concatMap } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { ContentRepository } from '../repository/content.repo';
import { EventColor } from 'calendar-utils';
@Injectable({
  providedIn: 'root',
})
export class SchedulingService {
  private errorSubject = new Subject<string>();
  errorObservable$ = this.errorSubject.asObservable();

  private calendarCompleteSubject = new Subject<CalendarEvent[]>();
  calendarCompleteObservable$: Observable<CalendarEvent[]> = this.calendarCompleteSubject.asObservable();

  colors: Record<string, EventColor> = {
    facebook: {
      primary: '#3b5998',
      secondary: '#8b9dc3',
    },
    twitter: {
      primary: '#1DA1F2',
      secondary: '#AAB8C2',
    },
    instagram: {
      primary: '#C13584',
      secondary: '#E1306C',
    },
    blog: {
      primary: '#FF0000',
      secondary: '#C13584',
    },
    linkedin: {
      primary: '#0077B5',
      secondary: '#0077B5',
    },
    default: {
      primary: '#000000',
      secondary: '#000000',
    },
  };

  constructor(
    private fireAuthRepo: FireAuthRepository,
    private contentRepo: ContentRepository
  ) {
    /** */
  }

  createContent(
    promptValue: string,
    imageValue: string,
    frequencyValue: string
  ) {
    const userId = this.fireAuthRepo.currentSessionUser?.uid;
    if (userId === undefined || userId === '') {
      this.errorSubject.next('User is not logged in');
      return;
    }

    const inputData = {
      userUuid: userId,
      content: promptValue,
      image: imageValue,
      frequency: frequencyValue,
    };

    this.contentRepo.createBulkTextContent(inputData).subscribe({
      next: (postResponse: {}[]) => {
        console.log("🚀 ~ file: content.service.ts:72 ~ ContentService ~ this.contentRepo.createBulkTextContent ~ postResponse:", postResponse)
        if (postResponse.length > 0) {
          this.getAllEvents();
        } else {
          this.errorSubject.next('No posts were created');
        }
      },
      error: (error) => {
        this.errorSubject.next(error);
      },
    });
  }

  getAllEvents() {
    this.fireAuthRepo.getUserAuthObservable().pipe(
      concatMap((user) => this.contentRepo.getScheduledContent(user.uid)),
    ).subscribe({
      next: (postResponse: {}[]) => { this.calendarCompleteSubject.next(this.postsToEvents(postResponse)); },
      error: (error) => { this.errorSubject.next(error); }
    });
  }

  postsToEvents(postResponse: {}[]): CalendarEvent[] {
    const calendarEvents: CalendarEvent[] = [];
    for (const post of postResponse) {
      let event = this.convert_post_to_event(post);
      calendarEvents.push(event);
    }
    return calendarEvents
  }

  convert_post_to_event(post: any): CalendarEvent {
    switch (post.post_type) {
      case 'facebook':
        post = {
          post_date: post.post_date,
          title: post.message.slice(0, 12),
          content: post.message,
          image_url: post.url,
          media_type: post.media_type,
          set_to_publish: post.published,
          color: this.colors['facebook'].primary,
          accent_color: this.colors['facebook'].secondary,
        };
        break;
      case 'twitter':
        let image_media = 'NONE';
        if (post.media_url !== '') {
          image_media = 'IMAGE';
        }
        post = {
          post_date: post.post_date,
          title: post.tweet.slice(0, 12),
          content: post.tweet,
          image_url: post.media_url,
          media_type: image_media,
          set_to_publish: true,
          color: this.colors['twitter'].primary,
          accent_color: this.colors['twitter'].secondary,
        };
        break;
      case 'instagram':
        post = {
          post_date: post.post_date,
          title: post.caption.slice(0, 12),
          content: post.caption,
          image_url: post.image_url,
          media_type: 'IMAGE',
          set_to_publish: post.published,
          color: this.colors['instagram'].primary,
          accent_color: this.colors['instagram'].secondary,
        };
        break;
      case 'blog':
        post = {
          post_date: post.post_date,
          title: post.title,
          content: post.content,
          image_url: '',
          media_type: 'NONE',
          set_to_publish: true,
          color: this.colors['blog'].primary,
          accent_color: this.colors['blog'].secondary,
        };
        break;
      default:
        break;
    }

    return {
      start: new Date(post.post_date),
      title: post.title,
      color: {
        primary: post.color,
        secondary: post.accent_color,
      },
      meta: {
        ...post,
      },
    };
  }

  getPostData() {
    return this.contentRepo.newlyCreatedPostData;
  }
}
