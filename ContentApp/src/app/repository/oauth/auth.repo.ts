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
import { Observable, from, map } from 'rxjs';
import { ApiResponse } from 'src/app/model/response/apiresponse.model';
import { ZoomUser } from 'src/app/model/user/zoomuser';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationRepository {
  
  private linkedinRedirectUri = 'http://localhost:4200/linkedin-callback';
  private linkedinScopes = ['r_liteprofile', 'r_emailaddress', 'w_member_social'];
  
  private zoomRedirectUri = 'http://localhost:4200/zoom-callback';

  linkedinAuthCodeParams = {
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: this.linkedinRedirectUri,
    state: this.createCSRFtoken(),
    scope: this.linkedinScopes.join(' '),
  };

  constructor() {
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
        console.log("🚀 ~ file: linkedinauth.repo.ts:34 ~ LinkedinAuthRepository ~ map ~ response:", response)
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
    return from(
      axios.get<{message: string, result: any}>('http://localhost:3000/api/v2/config/zoom', {
        params: {
          code: zoomCode,
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
}
