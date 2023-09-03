import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, from, map, tap } from 'rxjs';
import { FireAuthRepository } from '../database/fireauth.repo';
import { ContentResponse } from 'src/app/model/contentresponse.model';

const contentMachineUrlv2 = 'http://localhost:3000/api/v2';

@Injectable({
  providedIn: 'root',
})
export class VideoRepository {

  constructor(
    private fireAuthRepo: FireAuthRepository,
  ) {
    /** */
  }

  getContentFromVideo(
    title: string, 
    videoUuid: string, 
    model: string
  ): Observable<ContentResponse> {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `${contentMachineUrlv2}/content`,
      data: {
        userUuid: this.fireAuthRepo.currentSessionUser!.uid,
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
        return response.data as ContentResponse;
      })
    );
  }
}
