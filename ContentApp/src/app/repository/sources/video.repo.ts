import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, Subject, concatMap, from, map, of, tap } from 'rxjs';
import { YoutubeTranscript } from 'src/app/model/youtubetranscript.model';
import { FireAuthRepository } from '../database/fireauth.repo';

const contentMachineUrl = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})
export class VideoRepository {

  constructor(
    private fireAuthRepo: FireAuthRepository,
  ) {
    /** */
  }

  getYoutubeTranscript(videoUuid: string, model: string): Observable<YoutubeTranscript> {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `${contentMachineUrl}/download`,
      data: {
        userUuid: this.fireAuthRepo.currentSessionUser!.uid,
        videoUuid: videoUuid,
        model: model
      },
    };
    return from(axios(config)).pipe(
      tap((response: AxiosResponse<any, any>) => {
        console.log('Response:', response.data);
      }),
      map((response: AxiosResponse<any, any>) => {
        return response.data as YoutubeTranscript;
      })
    );
  }
}
