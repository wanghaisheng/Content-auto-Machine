/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */
import { Injectable } from "@angular/core";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, concat, concatMap, from, map, tap } from 'rxjs';
import { FireAuthRepository } from "../database/fireauth.repo";
import { ApiResponse } from "src/app/model/response/apiresponse.model";
import { Meeting, Recording, ZoomRecordings } from "src/app/model/source/zoomrecordings.model";
import { Content } from "src/app/model/content/content.model";

@Injectable({
  providedIn: 'root',
})
export class ZoomRepository {

  contentMachineUrlv2 = 'http://localhost:3000/api/v2';

  constructor(
    private firebaseAuthRepo: FireAuthRepository
  ) {}

  getZoomMeetings(): Observable<Meeting[]> {
    return this.firebaseAuthRepo.getUserAuthObservable().pipe(
      concatMap((user) => { 
        const config: AxiosRequestConfig = {
          method: 'get',
          url: `${this.contentMachineUrlv2}/meetings/all?userId=${user.uid}`,
          data: {},
        };
        return from(axios(config))
      }),
      map((response: AxiosResponse<any, any>) => {
        console.log("🚀 ~ file: zoom.repo.ts:39 ~ ZoomRepository ~ map ~ response:", response)
        const responseData = response.data as ApiResponse<Meeting[]>;
        if (responseData.message !== 'success') {
          throw new Error('🔥 Failed to get success');
        } else {
          return responseData.result;
        }
      })
    )
  }

  getContentFromMeeting(title: string, zoomMeetingId: number, aiModel: string, contentType: string): Observable<Content> {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `${this.contentMachineUrlv2}/meetings/recording?userId=${this.firebaseAuthRepo.currentSessionUser?.uid}&meetingId=${zoomMeetingId}&model=${aiModel}&contentType=${contentType}`,
      data: {},
    };
    return from(axios(config)).pipe(
      map((response: AxiosResponse<any, any>) => {
        const responseData = response.data as ApiResponse<Content>;
        if (responseData.message !== 'success') {
          throw new Error('🔥 Failed to get success');
        } else {
          return responseData.result;
        }
      })
    )
  }
}
