/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Query,
  addDoc,
  DocumentSnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import {
  Database,
  onValue,
  push,
  ref,
  set,
  update,
} from '@angular/fire/database';
import { concatMap, filter, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FireAuthRepository } from './fireauth.repo';
import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { sub } from 'date-fns';

/**
 * Collection and Docuemnts Architecture
 */
export const PURCHASED_USERS_COL = 'purchased_users';

export const USERS_COL = 'users';
export const PERSONAL_ACCTS_DOC = 'social_accounts';

export const PostingPlatform = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  YOUTUBE: 'youtube',
  MEDIUM: 'medium',
  TIKTOK: 'tiktok',
  LINKEDIN: 'linkedin',
};

/**
 * Accounts and Oauth 2.0
 */
export const DISPLAY_NAME = 'display_name';
export const USER_ID = 'user_id';
export const PLATFORM = 'platform';
export const HANDLE = 'handle';
export const ACCESS_TOKEN = 'access_token';
export const LAST_LOGIN_AT = 'last_login_at';
export const CREATION_TIME = 'creation_time';
export const REFRESH_TOKEN = 'refresh_token';
export const SCOPE = 'scopes';
export const PAGE = 'page';

@Injectable({
  providedIn: 'root',
})
export class FirestoreRepository {
  private database: Database = inject(Database);

  constructor(
    private firestore: Firestore,
    private fireAuth: FireAuthRepository
  ) {
    /** */
  }

  getDocumentAsUser<T>(
    collectionPath: string,
    documentKey: string
  ): Observable<T> {
    return new Observable<T>((subject) => {
      const user = this.fireAuth.currentSessionUser;
      if (!user) {
        subject.next({} as T);
        subject.complete();
      } else {
        const collectionRef = ref(
          this.database,
          `${USERS_COL}/${user.uid}/${collectionPath}/${documentKey}`
        );
        onValue(
          collectionRef,
          (snapshot) => {
            subject.next(snapshot.val() as T);
            subject.complete();
          },
          (errorObject) => {
            console.log(
              '🔥 ~ file: firebase_core.js:72 ~ FirebaseCore ~ this.db.ref ~ errorObject:',
              errorObject
            );
            subject.error(errorObject.name);
          }
        );
      }
    }).pipe(filter((data) => !!data));
  }

  createUserDocument<T>(
    collectionPath: string,
    data: T,
    userId: string = this.fireAuth.currentSessionUser?.uid || ''
  ): Observable<T> {
    const userDocRef = ref(this.database, `${collectionPath}/${userId}`);
    set(userDocRef, data);
    return of(data);
  }

  updateCurrentUserDocument<T>(data: Partial<T>): Observable<T> {
    return new Observable<T>((subject) => {
      if (this.fireAuth.currentSessionUser == null) {
        console.log(
          '🔥 ~ file: firestore.repo.ts:98 ~ FirestoreRepository ~ currentSessionUser:',
          'no user logged in'
        );
        subject.error('No user is logged in');
        subject.complete();
      } else {
        const userDocRef = ref(
          this.database,
          `${USERS_COL}/${this.fireAuth.currentSessionUser.uid}`
        );
        update(userDocRef, this.sanitizeObject(data)).then(() => {
          subject.next(data as T);
          subject.complete();
        });
      }
    });
  }

  getUserInfoAsDocument(
    collectionPath: string,
    documentKey: string
  ): Observable<any> {
    const newKey = documentKey.replace(/\./g, '_');
    const userDocRef = ref(this.database, `${collectionPath}/${newKey}`);
    return new Observable<any>((subject) => {
      onValue(
        userDocRef,
        (snapshot) => {
          subject.next(snapshot.val());
          subject.complete();
        },
        (errorObject) => {
          console.log(
            '🔥 ~ file: firebase_core.js:72 ~ FirebaseCore ~ this.db.ref ~ errorObject:',
            errorObject
          );
          subject.error(errorObject.name);
        }
      );
    })
  }
  
  getUserCollection<T>(
    collectionPath: string,
    userId: string = this.fireAuth.currentSessionUser?.uid || ''
  ): Observable<T[]> {
    if (userId === '') {
      return this.fireAuth.getUserAuthObservable().pipe(
        concatMap((user) => {
          return this.getSpecificCollectionRef<T>(collectionPath, user.uid);
        })
      );
    } else {
      return this.getSpecificCollectionRef<T>(collectionPath, userId);
    }
  }

  private getSpecificCollectionRef<T>(
    collectionPath: string,
    userId: string
  ): Observable<T[]> {
    const collectionRef = ref(this.database, `${collectionPath}/${userId}/${collectionPath}`);
    return new Observable<T[]>((subject) => {
      onValue(
        collectionRef,
        (snapshot) => {
          subject.next(snapshot.val() as T[]);
          subject.complete();
        },
        (errorObject) => {
          console.log(
            '🔥 ~ file: firebase_core.js:72 ~ FirebaseCore ~ this.db.ref ~ errorObject:',
            errorObject
          );
          subject.error(errorObject.name);
        }
      );
    });
  }

  updateCurrentUserCollectionDocument<T>(
    collectionKey: string,
    documentKey: string,
    data: Partial<T>
  ): Observable<boolean> {
    return new Observable<boolean>((subject) => {
      if (this.fireAuth.currentSessionUser == null) {
        subject.error('User is not logged in');
        subject.complete();
      } else {
        const collectionRef = ref(
          this.database,
          `${USERS_COL}/${this.fireAuth.currentSessionUser.uid}/${collectionKey}/${documentKey}`
        );
        update(collectionRef, this.sanitizeObject(data)).then(() => {
          subject.next(true);
          subject.complete();
        }).catch((error: any) => {
          subject.next(false);
          subject.complete();
        });
      }
    });
  }

  // Helper function to sanitize the object and remove undefined values
  private sanitizeObject(obj: any): any {
    const sanitizedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value !== 'undefined') {
        sanitizedObj[key] = value;
      }
    }
    return sanitizedObj;
  }
}
