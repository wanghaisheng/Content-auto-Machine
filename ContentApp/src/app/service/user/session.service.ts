/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { Observable, Subject, catchError, concatMap, map, of } from 'rxjs';
import { FirebaseUser } from '../../model/user/user.model';
import { FireAuthRepository } from '../../repository/database/fireauth.repo';
import { User } from '@angular/fire/auth';
import { FirestoreRepository, PURCHASED_USERS_COL, USERS_COL } from 'src/app/repository/database/firestore.repo';
import { DocumentReference } from '@angular/fire/firestore';
import { SocialAuthService } from './socialauth.service';
import { PurchasedUser } from 'src/app/model/user/purchasedUser.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  
  private errorSubject = new Subject<string>();

  constructor(
    private fireAuthRepo: FireAuthRepository,
    private firestoreRepo: FirestoreRepository,
    private navigationService: NavigationService,
    private socialAuthService: SocialAuthService
  ) {
    this.fireAuthRepo.getUserAuthObservable().subscribe((user) => {
      // will reinsert if needed later
      // this.setUserData(user);
    });
  }

  checkForAuthLogoutRedirect() {
    this.fireAuthRepo.getUserAuthObservable().subscribe({
      next: (user) =>{
        if (user === null) {
          this.navigationService.navigateToLogin();
        } else {
          this.navigationService.navigateToRoot();
        }
      }
    });
  }

  verifyEmailWithGoogle() {
    this.socialAuthService.signInWithGoogle().subscribe({
      next: (user) => {
        if (user !== null) {
          this.verifyEmail(user);
        } else {
          this.errorSubject.next('Google Auth Error');
        }
      },
      error: (error) => {
        console.log('🔥 ' + error);
        this.errorSubject.next(error);
      }
    });
  }

  verifyPurchaseEmail(email: string): Observable<boolean> {
    return this.firestoreRepo.getDocument(PURCHASED_USERS_COL, email).pipe(
      map((doc) => {
        if (doc !== undefined && doc !== null) {
          console.log("🚀 ~ file: session.service.ts:89 ~ SessionService ~ map ~ doc:", doc)
          return true;
        } else {
          console.log("🚀 ~ file: session.service.ts:92 ~ SessionService ~ map ~ else:", 'no such document!')
          return false;
        }
      })
    );
  }

  getErrorObserver(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  getProfilePic(): string {
    return (
      this.fireAuthRepo.currentSessionUser?.photoURL ?? 'https://placehold.co/48x48'
    );
  }

  getAuthStateObserver(): Observable<FirebaseUser> {
    return this.fireAuthRepo.getUserAuthObservable();
  }

  verifyEmail(authUser: any) {
    console.log("🚀 ~ file: session.service.ts:109 ~ SessionService ~ verifyEmail ~ authUser:", authUser)
    const email = authUser.email;

    if (email !== undefined && email !== '') {
      this.firestoreRepo.getDocument<PurchasedUser>(PURCHASED_USERS_COL, email ?? '').subscribe({
        next: (user) => {
          if (user !== undefined && user !== null) {
            console.log("🚀 ~ file: session.service.ts:144 ~ SessionService ~ setUserData ~ user:", user)
            const userData: FirebaseUser = {
              uid: authUser.uid ?? '',
              email: authUser.email ?? '',
              displayName: authUser.displayName ?? '',
              photoURL: authUser.photoURL ?? '',
              emailVerified: authUser.emailVerified ?? '',
              lastLogin: authUser.reloadUserInfo.lastLoginAt,
              creationTime: authUser.reloadUserInfo.createdAt,
              lastRefreshAt: authUser.reloadUserInfo.lastRefreshAt,
              idToken: authUser.google_credentials.idToken,
              isFirstTimeUser: true,
            };

            this.setUserData({
              ...userData
            });

            this.navigationService.navigateToRoot();
          } else {
            this.fireAuthRepo.signOut();
            this.errorSubject.next(
              'You are not authorized to use this application. Please contact us.'
            );
          }
        },
        error: (error) => {
          console.debug('🔥' + error);
          this.fireAuthRepo.signOut();
          this.errorSubject.next(error);
        },
      });
    } else {
      this.errorSubject.next(
        "We couldn't create your account. Please contact us."
      );
    }
  }

  /* Setting up user data when sign in with username/password,
   * sign up with username/password and sign in with social auth
   * provider in Firestore database using AngularFirestore + AngularFirestoreDocument service
   */
  async setUserData(user: FirebaseUser) {
    // Check if the user document exists
    this.firestoreRepo.getDocument(USERS_COL, user.uid ?? '').subscribe((doc) => {
      if (doc !== undefined && doc !== null) {
        console.log("🚀 ~ Updating user")
        // User exists, update the existing user data
        // userData.isVirgin = false;
        this.firestoreRepo.updateCurrentUserDocument(user);
      } else {
        console.log("🚀 ~ Creating new user")
        console.log(user)
        // User doesn't exist, create a new user document
        this.firestoreRepo.createUserDocument(USERS_COL, user, user.uid);
      }
    });
  }
}
