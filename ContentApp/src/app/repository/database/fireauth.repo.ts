/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject, from, map, of } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';
import { PURCHASED_USERS_COL, USERS_COL } from './firestore.repo';
import { FirestoreRepository } from './firestore.repo';
import { FirebaseUser } from '../../model/user/user.model';
import { DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FireAuthRepository {

  currentSessionUser?: FirebaseUser;
  user$;

  private userSubject: Subject<FirebaseUser> = new Subject<FirebaseUser>();

  constructor(
    private fireAuth: Auth
  ) {
    this.user$ = user(this.fireAuth);
    
    this.user$.subscribe((user: any) => {
      console.log("🚀 ~ file: fireauth.repo.ts:33 ~ FireAuthRepository ~ this.user$.subscribe ~ user:", user)
      if (user) {
        // Only our initial user is set for the session variable
        if (user.providerData[0].providerId == 'google.com') {
          this.currentSessionUser = user;
          this.userSubject.next(user);
        } else {
          // with poor design this is where we would make an advanced query to get the parent user based on child creds
        }
      } else {
        // reset sessionUser
        this.currentSessionUser = undefined;
      }
    });
  }

  getUserAuthObservable(): Observable<FirebaseUser> {
    console.log("🚀 ~ file: fireauth.repo.ts:50 ~ FireAuthRepository ~ getUserAuthObservable ~ currentSessionUser:", this.currentSessionUser)
    if (this.currentSessionUser !== null && this.currentSessionUser !== undefined) {
      return new Observable((subject) => {
        subject.next(this.currentSessionUser);
      });
    } else {
      return this.userSubject.asObservable();
    }
  }

  // Sign out
  signOut(): Promise<void> {
    this.currentSessionUser = undefined;
    return this.fireAuth.signOut();
  }
}
