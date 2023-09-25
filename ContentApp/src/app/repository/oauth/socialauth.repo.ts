/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable } from '@angular/core';
import { LINKEDIN_CLIENT_ID } from 'appsecrets';
import axios from 'axios';
import { Observable, combineLatest, concat, concatMap, forkJoin, from, map, switchMap } from 'rxjs';
import { ApiResponse } from 'src/app/model/response/apiresponse.model';
import { ZoomUser } from 'src/app/model/user/zoomuser';
import { FireAuthRepository } from '../database/fireauth.repo';
import { PostingPlatform } from 'src/app/constants';
import { ACCESS_TOKEN, FirestoreRepository } from '../database/firestore.repo';
import { SocialAccount } from 'src/app/model/user/socialaccount.model';
import { FacebookRepository } from '../apis/facebook.repo';
import { FacebookPage } from 'src/app/model/content/facebookpage.model';
import {
  PLATFORM,
  SCOPE,
  PAGE
} from '../../repository/database/firestore.repo';
import { YoutubeAuthRepository } from './youtubeauth.repo';

@Injectable({
  providedIn: 'root',
})
export class SocialAuthRepository {
  
  private linkedinRedirectUri = 'http://localhost:4200/linkedin-callback';
  private linkedinScopes = ['r_liteprofile', 'r_emailaddress', 'w_member_social'];
  private googleScopes = [];
  private mediumScopes = [];
  private twitterScopes = [
    'tweet.read',
    'tweet.write',
    'tweet.delete',
    'follows.write',
  ];
  
  linkedinAuthCodeParams = {
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: this.linkedinRedirectUri,
    state: this.createCSRFtoken(),
    scope: this.linkedinScopes.join(' '),
  };

  private SOCIAL_ACCTS_DOC = 'social_accounts';

  constructor(
    private fireAuthRepo: FireAuthRepository,
    private firestoreRepo: FirestoreRepository,
    private facebookRepo: FacebookRepository,
    private youtubeAuthRepo: YoutubeAuthRepository
  ) {
    /** */
  }

  exchanceAuthCodeForAccessToken(linkedInAuthCode: string): Observable<any> {
    return from(
      axios.get<{message: string, data: any}>('http://localhost:8000/api/linkedin', {
        params: {
          authCode: linkedInAuthCode,
        }
      })
    ).pipe(
      map((response) => {
        if (response.data.message !== 'success') {
          throw new Error('Failed to exchange auth code for access token');
        }
        return response.data.data;
      })
    );
  }

  private createCSRFtoken(): string {
    /**
     * This function generates a random string of letters.
     * It is not required by the Linkedin API to use a CSRF token.
     * However, it is recommended to protect against cross-site request forgery.
     */
    const letters: string = 'abcdefghijklmnopqrstuvwxyz';
    let token: string = '';
    for (let i = 0; i < 20; i++) {
      token += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return token;
  }

  getAuthorizedZoomUser(zoomCode: string): Observable<ApiResponse<ZoomUser>> {
    return this.fireAuthRepo.getUserAuthObservable().pipe(
      concatMap((user) => this.getZoomAuthConfig(zoomCode, user.uid))
    );
  }

  getZoomAuthConfig(zoomCode: string, userId: string) {
    return from(
      axios.get<{message: string, result: any}>('http://localhost:3000/api/v2/config/zoom', {
        params: {
          code: zoomCode,
          userId: userId,
        }
      })
    ).pipe(
      map((response) => {
        if (response.data.message !== 'success') {
          throw new Error('Failed to exchange auth code for access token');
        }
        return response.data.result;
      })
    );
  }

  saveYoutubeAuth(): Observable<boolean> {
    return this.youtubeAuthRepo.tokenResponseObserver$.pipe(
      map((tokenResponse) => {
        return {
          [PLATFORM]: PostingPlatform.YOUTUBE,
          [ACCESS_TOKEN]: tokenResponse,
          [SCOPE]: this.youtubeAuthRepo.youtubeScopes,
        }
      }),
      concatMap((oAuth2Payload) => this.firestoreRepo.updateCurrentUserCollectionDocument(
        this.SOCIAL_ACCTS_DOC,
        PostingPlatform.YOUTUBE,
        oAuth2Payload
      ))
    );
  }

  getFacebookPages(): Observable<FacebookPage[]> {
    return this.firestoreRepo
      .getCollectionDocumentAsUser<SocialAccount>(
        this.SOCIAL_ACCTS_DOC,
        PostingPlatform.FACEBOOK
      )
      .pipe(
        concatMap((facebookAccount: SocialAccount) =>
          this.facebookRepo.getFacebookPages(
            facebookAccount.user_id ?? '',
            facebookAccount.access_token
          )
        )
      )
  }

  updateFacebookPageForInstagramAccts(page: FacebookPage) {
    return this.facebookRepo.getAssociatedInstagramAccounts(page).pipe(
      map((instagramAccounts) => {
        if (instagramAccounts.length === 0) {
          throw new Error('No Instagram accounts associated with this Facebook page');
        }
        this.firestoreRepo.updateCurrentUserCollectionDocument(
          this.SOCIAL_ACCTS_DOC,
          PostingPlatform.FACEBOOK,
          { [PAGE]: page }
        );
        return instagramAccounts;
      }),
      concatMap((instagramAccounts) => this.firestoreRepo.updateCurrentUserCollectionDocument(
        this.SOCIAL_ACCTS_DOC,
        PostingPlatform.INSTAGRAM,
        instagramAccounts
      ))
    )
  }

  //TODO this is the one we're looking to update to keep others from seeing
  // the authentication key
  getAuthenticatedSocialAccts() {
    const requests: Observable<{ [key: string]: boolean }>[] = [];
    return this.fireAuthRepo.getUserAuthObservable().pipe(
      map((user) => {
        Object.values(PostingPlatform).forEach((platform) => {
          const request: Observable<{ [key: string]: boolean }> = this.firestoreRepo.confirmUserCollectionChild(
            user.uid,
            this.SOCIAL_ACCTS_DOC,
            platform
          ).pipe(
            map((isAuthenticated) => {
              return {
                [platform]: isAuthenticated,
              };
            }
          ));
          requests.push(request);
        });
        return requests;
      }),
      concatMap((requests) => combineLatest(requests)),
    ); 
  }
}
