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
import { Generators } from '../model/response/generators.model';

const contentMachineUrlv2 = 'http://localhost:3000/api/v2';

@Injectable({
  providedIn: 'root',
})
export class AdminRepository {

  getGenerators(): Observable<Generators> {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `${contentMachineUrlv2}/config`,
      data: {},
    };
    return from(axios(config)).pipe(
      tap((response: AxiosResponse<any, any>) => {
        console.log('🚰 Response:', response.data);
      }),
      map((response: AxiosResponse<any, any>) => {
        const responseData = response.data as ApiResponse<Generators>;
        if (responseData.message !== 'success') {
          throw new Error('🔥 Failed to get content from video');
        } else {
          return responseData.result;
        }
      })
    );
  }
}
