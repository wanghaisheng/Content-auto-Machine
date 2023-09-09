/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */
import { Injectable } from "@angular/core";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, from, map, tap } from 'rxjs';
import { FireAuthRepository } from "../database/fireauth.repo";
import { ApiResponse } from "src/app/model/response/apiresponse.model";
import { Recording, ZoomRecordings } from "src/app/model/source/zoomrecordings.model";

@Injectable({
  providedIn: 'root',
})
export class ZoomRepository {

  contentMachineUrlv2 = 'http://localhost:3000/api/v2';

  constructor(
    private firebaseAuthRepo: FireAuthRepository
  ) {}

  getZoomRecordings(): Observable<Recording> {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `${this.contentMachineUrlv2}/meetings/recordings`,
      data: {},
    };
    return from(axios(config)).pipe(
      tap((response: AxiosResponse<any, any>) => {
        console.log('🚰 Response:', response.data);
      }),
      map((response: AxiosResponse<any, any>) => {
        const responseData = response.data as ApiResponse<ZoomRecordings>;
        if (responseData.message !== 'success') {
          throw new Error('🔥 Failed to get content from video');
        } else {
          return responseData.result;
        }
      })
    );
  }
}
