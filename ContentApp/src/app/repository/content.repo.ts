/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, Subject, concatMap, from, map, of, tap } from 'rxjs';
import { ApiResponse } from '../model/response/apiresponse.model';
import { FireAuthRepository } from './database/fireauth.repo';
import { Content } from '../model/content/content.model';

const contentMachineUrl = 'http://localhost:3000/api';
const contentMachineUrlv2 = 'http://localhost:3000/api/v2';

@Injectable({
  providedIn: 'root',
})
export class ContentRepository {

  newlyCreatedPostData: {}[] = [];

  constructor(
    private fireAuthRepo: FireAuthRepository
  ) {
    /** */
  }

  getAllContent(userUuid: string): Observable<any> {
    return from(axios.get(`${contentMachineUrl}/posts/${userUuid}`)).pipe(
      tap((response: AxiosResponse<any, any>) => {
        console.log('Response:', response.data);
      }),
      concatMap((response: AxiosResponse<any, any>) => this.getPostList(response))
    );
  }

  createBulkTextContent(inputData: {
    userUuid: string;
    content: string;
    image: string;
    frequency: string;
  }): Observable<any> {
    return from(axios.post(`${contentMachineUrl}/text-posts`, inputData)).pipe(
      tap((response: AxiosResponse<any, any>) => {
        console.log('Response:', response.data);
      }),
      concatMap((response: AxiosResponse<any, any>) => this.getPostList(response))
    );
  }

  private getPostList(response: AxiosResponse<any, any>) {
    if (response === null || response == undefined || response.data === null) {
      return of([]);
    } else {
      let postBundles = this.mapResponseToPosts(response.data);
      this.newlyCreatedPostData = postBundles;
      return of(postBundles);
    }
  }

  private mapResponseToPosts(responseData: AxiosResponse<any, any>): {}[] {
    const postsList: {}[] = [];

    for (const [post_type, posts] of Object.entries(responseData)) {
      for (const [date_key, post_data] of Object.entries(posts)) {
        let currPostBundle: {} = {
          post_type: post_type,
          post_date: date_key,
          ...(post_data as {}),
        };
        postsList.push(currPostBundle);
      }
    }
    return postsList;
  }

  getContentFromVideo(
    title: string, 
    videoUuid: string, 
    model: string
  ): Observable<Content> {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `${contentMachineUrlv2}/content`,
      data: {
        userId: this.fireAuthRepo.currentSessionUser!.uid,
        videoId: videoUuid,
        title: title,
        model: model
      },
    };
    return from(axios(config)).pipe(
      tap((response: AxiosResponse<any, any>) => {
        console.log('Response:', response.data);
      }),
      map((response: AxiosResponse<any, any>) => {
        const responseData = response.data as ApiResponse<Content>;
        if (responseData.message !== 'success') {
          throw new Error('🔥 Failed to get content from video');
        } else {
          return responseData.result;
        }
      })
    );
  }
}
