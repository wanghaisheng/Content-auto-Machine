/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable } from '@angular/core';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  TwitterAuthProvider,
} from 'firebase/auth';
import {
  catchError,
  concat,
  concatMap,
  from,
  map,
  Observable,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FireAuthRepository } from '../../repository/database/fireauth.repo';
import { YoutubeAuthRepository } from '../../repository/oauth/youtubeauth.repo';
import { SocialAuthRepository as SocialAuthRepository } from '../../repository/oauth/socialauth.repo';
import { NavigationService } from '../navigation.service';
import { FacebookPage } from '../../model/content/facebookpage.model';
import { PostingPlatform } from 'src/app/constants';
import { FacebookRepository } from 'src/app/repository/apis/facebook.repo';
import { error } from 'firebase-functions/logger';

@Injectable({
  providedIn: 'root',
})
export class SocialAuthService {
  private auth = getAuth();

  private googleProvider = new GoogleAuthProvider();
  private twitterProvider = new TwitterAuthProvider();

  private mediumAuthSubject = new Subject<boolean>();
  private twitterAuthSubject = new Subject<boolean>();
  private facebookAuthSubject = new Subject<boolean>();
  private linkedinAuthSubject = new Subject<boolean>();
  private zoomAuthSubject = new Subject<boolean>();

  private conectionsLoadingSubject = new Subject<boolean>();
  private errorSubject = new Subject<string>();

  constructor(
    private navigationService: NavigationService,
    private fireAuthRepo: FireAuthRepository,
    private youtubeAuthRepo: YoutubeAuthRepository,
    private socialAuthRepo: SocialAuthRepository,
    private facebookRepo: FacebookRepository
  ) {
    /** */
  }

  private userInstagramLinkSuccess = new Subject<boolean>();
  getInstagramLinkSuccessObservable$ =
  this.userInstagramLinkSuccess.asObservable();
  
  getMediumAuthObservable$ = this.mediumAuthSubject.asObservable();
  getTwitterAuthObservable$ = this.twitterAuthSubject.asObservable();
  getFacebookAuthObservable$ = this.facebookAuthSubject.asObservable();
  getLinkedinAuthObservable$ = this.linkedinAuthSubject.asObservable();
  getZoomAuthObservable$ = this.zoomAuthSubject.asObservable();
  
  getConnectionLoadingObservable$ =
  this.conectionsLoadingSubject.asObservable();
  getErrorObservable$ = this.errorSubject.asObservable();
  
  userAccountObservable$ = this.fireAuthRepo.getUserAuthObservable();
  userSocialAccountsObservable$ = this.socialAuthRepo.getAuthenticatedSocialAccts().pipe(
    take(1),
  );
  youtubeAuthObservable$ = this.socialAuthRepo.saveYoutubeAuth();
  facebookPagesObservable$ = this.socialAuthRepo.getFacebookPages();

  getAssociatedInstagramAccounts(page: FacebookPage) {
    this.socialAuthRepo.updateFacebookPageForInstagramAccts(page)
      .subscribe({
        next: (success) => {
          this.userInstagramLinkSuccess.next(success);
        },
        error: (error) => {
          this.errorSubject.next(error);
        },
      });  
  }

  signInWithGoogle(): Observable<any> {
    return new Observable((subscriber) => {
      signInWithPopup(this.auth, this.googleProvider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          const sessionUser = {
            ...user,
            google_credentials: credential,
          };
          subscriber.next(sessionUser);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);

          subscriber.error(credential);
          // ...
        });
    });
  }

  /**
   * This is not working except in HTTPS published
   */
  // signInWithFacebook(authCode: string) {
  //   this.facebookRepo
  //     .exchangeAuthCodeForAccessToken(authCode)
  //     .pipe(
  //       concatMap((accessTokenObj: { accessToken: string }) => {
  //         console.log(accessTokenObj);
  //         return this.facebookRepo
  //           .getFacebookUserId(accessTokenObj.accessToken)
  //           .pipe(
  //             map((user_id: string) => {
  //               return {
  //                 [USER_ID]: user_id,
  //                 [ACCESS_TOKEN]: accessTokenObj.accessToken,
  //               };
  //             })
  //           );
  //       }),
  //       concatMap((accessTokenObj: { user_id: string; access_token: string }) =>
  //         this.firestoreRepo.updateCurrentUserCollectionDocument(
  //           this.SOCIAL_ACCTS_DOC,
  //           PostingPlatform.FACEBOOK,
  //           {
  //             [PLATFORM]: PostingPlatform.FACEBOOK,
  //             ...accessTokenObj,
  //           }
  //         )
  //       )
  //     )
  //     .subscribe({
  //       next: (result) => {
  //         if (result) {
  //           this.navigationService.navigateToRoot();
  //           this.facebookAuthSubject.next(true);
  //         } else {
  //           this.errorSubject.next('LinkedIn Auth Error');
  //         }
  //       },
  //       error: (error) => {
  //         this.navigationService.navigateToRoot();
  //         this.errorSubject.next(error);
  //       },
  //     });
  // }

  // signInWithMedium(mediumAccessToken: string) {
  //   from(
  //     this.firestoreRepo.updateCurrentUserCollectionDocument(
  //       this.SOCIAL_ACCTS_DOC,
  //       PostingPlatform.MEDIUM,
  //       {
  //         [PLATFORM]: PostingPlatform.MEDIUM,
  //         [ACCESS_TOKEN]: mediumAccessToken,
  //       }
  //     )
  //   ).subscribe({
  //     next: (result) => {
  //       if (result) {
  //         this.mediumAuthSubject.next(true);
  //       } else {
  //         this.errorSubject.next('Medium Auth Error');
  //       }
  //     },
  //     error: (error) => {
  //       this.errorSubject.next(error);
  //     },
  //   });
  // }

  // signInWithTwitter() {
  //   this.conectionsLoadingSubject.next(true);
  //   from(signInWithPopup(this.auth, this.twitterProvider))
  //     .pipe(
  //       map((result) => {
  //         const resultUser = result.user;
  //         // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
  //         // You can use these server side with your app's credentials to access the Twitter API.
  //         const credential = TwitterAuthProvider.credentialFromResult(result);
  //         if (credential !== null) {
  //           const token = credential.accessToken;
  //           const secret = credential.secret;

  //           const oAuth2Payload = {
  //             [PLATFORM]: PostingPlatform.TWITTER,
  //             [HANDLE]: resultUser?.displayName || 'error',
  //             [ACCESS_TOKEN]: token,
  //             [REFRESH_TOKEN]: secret,
  //             [SCOPE]: this.twitterScopes,
  //             [LAST_LOGIN_AT]: resultUser.metadata.lastSignInTime,
  //             [CREATION_TIME]: resultUser.metadata.creationTime,
  //           };

  //           this.firestoreRepo.updateCurrentUserCollectionDocument(
  //             this.SOCIAL_ACCTS_DOC,
  //             PostingPlatform.TWITTER,
  //             oAuth2Payload
  //           );
  //         } else {
  //           this.errorSubject.next('Twitter Auth Error');
  //         }

  //         // The signed-in user info.
  //         const user = result.user;
  //         // IdP data available using getAdditionalUserInfo(result)
  //         // ...
  //       }),
  //       concatMap((result) => {
  //         const currentUser = this.fireAuthRepo.currentSessionUser;
  //         if (currentUser === undefined) {
  //           throw new Error('No current user');
  //         }
  //         return this.firestoreRepo.getUserInfoAsDocument(
  //           USERS_COL,
  //           currentUser?.uid
  //         );
  //       }),
  //       concatMap((userDoc: any) => {
  //         const constidToken = userDoc?.idToken;
  //         // Build Firebase credential with the Google ID token.
  //         const credential = GoogleAuthProvider.credential(constidToken);
  //         return signInWithCredential(this.auth, credential);
  //       })
  //     )
  //     .subscribe({
  //       next: (result) => {
  //         this.conectionsLoadingSubject.next(false);
  //       },
  //       error: (error) => {
  //         // Handle Errors here.
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         // The email of the user's account used.
  //         const email = error.customData.email;
  //         // The AuthCredential type that was used.
  //         const credential = GoogleAuthProvider.credentialFromError(error);

  //         this.twitterAuthSubject.next(true);
  //         this.conectionsLoadingSubject.next(false);
  //         this.errorSubject.next(errorMessage);
  //       },
  //     });
  // }

  signInWithYoutube() {
    this.conectionsLoadingSubject.next(true);
    this.youtubeAuthRepo.getRequestToken();
  }

  getLinkedInCredentials() {
    return this.socialAuthRepo.linkedinAuthCodeParams;
  }

  getZoomAccessToken(zoomCode: string) {
    this.socialAuthRepo.getAuthorizedZoomUser(zoomCode).subscribe({
      next: (result) => {
        this.zoomAuthSubject.next(true);
        this.navigationService.navigateToRoot();
      },
      error: (error) => {
        this.errorSubject.next(error);
        this.navigationService.navigateToRoot();
      },
    });
  }

  // getLinkedInAccessToken(authCode: string) {
  //   this.conectionsLoadingSubject.next(true);
  //   this.socialAuthRepo
  //     .exchanceAuthCodeForAccessToken(authCode)
  //     .pipe(
  //       concatMap((accessTokenObj: { message: string; data: any }) => {
  //         return this.firestoreRepo.updateCurrentUserCollectionDocument(
  //           this.SOCIAL_ACCTS_DOC,
  //           PostingPlatform.LINKEDIN,
  //           {
  //             [PLATFORM]: PostingPlatform.LINKEDIN,
  //             ...accessTokenObj,
  //           }
  //         );
  //       })
  //     )
  //     .subscribe({
  //       next: (result) => {
  //         this.conectionsLoadingSubject.next(false);
  //         console.log(
  //           '🚀 ~ file: socialaccount.service.ts:233 ~ SocialAccountService ~ .subscribe ~ result',
  //           result
  //         );
  //         if (result) {
  //           this.linkedinAuthSubject.next(true);
  //         } else {
  //           this.errorSubject.next('LinkedIn Auth Error');
  //         }
  //         this.navigationService.navigateToRoot();
  //       },
  //       error: (error) => {
  //         this.conectionsLoadingSubject.next(false);
  //         this.errorSubject.next(error);
  //         console.log(
  //           '🔥 ~ file: socialaccount.service.ts:235 ~ SocialAccountService ~ .subscribe ~ error',
  //           error
  //         );
  //         this.navigationService.navigateToRoot();
  //       },
  //     });
  // }

  isUserLoggedIn(): Observable<boolean> {
    return this.fireAuthRepo.getUserAuthObservable().pipe(
      map((user) => {
        return user !== undefined;
      })
    );
  }
}
