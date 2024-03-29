/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable } from "@angular/core";
import axios from 'axios';
import { Observable, from, map, tap } from 'rxjs';
import { FacebookPage } from "../../model/content/facebookpage.model";

@Injectable({
  providedIn: 'root',
})
export class FacebookRepository {

  private apiUrl = 'https://graph.facebook.com/v15.0';
  
  constructor() {
    /** */
  }

  getAssociatedInstagramAccounts(page: FacebookPage) {
    const url = `${this.apiUrl}/${page.id}`;
    return from(axios.get(url, {
      params: {
        fields: 'instagram_business_account',
        access_token: page.access_token
      }
    })).pipe(
      map((response: any) => response.data)
    );
  }

  getFacebookUserId(userAccessToken: string): Observable<string> {
    const url = `${this.apiUrl}/me`;
    return from(axios.get(url, {
      params: {
        fields: 'id',
        access_token: userAccessToken
      }
    })).pipe(
      map((response: any) => response.data.id)
    );
  }

  exchangeAuthCodeForAccessToken(facebookAuthCode: string): Observable<any> {
    return from(
      axios.get<{message: string, data: any}>('http://localhost:8000/api/facebook/callback', {
        params: {
          authCode: facebookAuthCode,
        }
      })
    ).pipe(
      map((response) => {
        console.log("🚀 ~ file: facebookauth.repo.ts:23 ~ map ~ response:", response)
        if (response.data.message !== 'success') {
          throw new Error('🔥 Failed to exchange auth code for access token');
        }
        return response.data.data;
      })
    );
  }

  getFacebookPages(userId: string, userAccessToken: string): Observable<FacebookPage[]> {
    if (userId === undefined || userId === '' || userAccessToken === undefined || userAccessToken === '') {
      throw new Error('🔥 Failed to get Facebook pages');
    }
    const url = `${this.apiUrl}/${userId}/accounts`;

    return from(axios.get(url, {
      params: {
        access_token: userAccessToken
      }
    })).pipe(
      map((response: any) => response.data.data)
    );
  }
}
