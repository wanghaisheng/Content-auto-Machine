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

/**
 * Collection and Docuemnts Architecture
 */
export const PURCHASED_USERS_COL = 'purchased_users';

export const USERS_COL = 'users';
export const PERSONAL_ACCTS_DOC = 'personal_accounts';

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
    const key = push(userDocRef, data).key;

    data = this.update(data, 'uid', key);
    return this.updateCurrentUserDocument<T>(data);
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
    }).pipe(filter((data) => !!data));
  }

  private update(item: any, key: any, value: any): any {
    item[key] = value;
    return item;
  }
  // getDocumentAsUser<T>(collectionPath: string, documentKey: string): Observable<T> {
  //   const user = this.fireAuth.currentSessionUser;
  //   if (!user) {
  //     return of({} as T);
  //   }

  //   const collectionRef =  collection(this.firestore, USERS_COL, user.uid, collectionPath);
  //   const docRef = doc(collectionRef, documentKey);

  //   return from(getDoc(docRef)).pipe(
  //     tap((data) => {
  //       if (!environment.production) {
  //         console.groupCollapsed(
  //           `❤️‍🔥 Firestore Streaming [${docRef.path}] [getDocumentAsUser] [${user.uid}]`
  //         );
  //         console.log(data);
  //         console.groupEnd();
  //       }
  //     }),
  //     filter((data) => !!data),
  //     map((data) => data.data() as T)
  //   );
  // }

  // Create a single data object under a user ID
  // async createUserDocument<T>(
  //   collectionPath: string,
  //   data: T,
  //   userId: string = this.fireAuth.currentSessionUser?.uid || ''
  // ): Promise<T> {
  //   //USERS_COL, userData, user.uid
  //   ///documents/users/6b9QvbnpIoZVHbb9l3fPcgbjQDg2/users/6b9QvbnpIoZVHbb9l3fPcgbjQDg2
  //   const usersRef =  collection(this.firestore, collectionPath);
  //   const userDocRef = doc(usersRef, userId);

  //   // The initial creation of our object and the update of the ID
  //   setDoc(userDocRef, this.sanitizeObject(data));

  //   data = this.update(data, 'uid', userDocRef.id);
  //   await this.updateCurrentUserDocument<T>(data);

  //   // await this.createUserCollection(USER_OAUTH_2_KEYS_DOC);

  //   if (!environment.production) {
  //     console.groupCollapsed(
  //       `❤️‍🔥 Firestore Service [${userDocRef.path}] [createUserDocument]`
  //     );
  //     console.log(`❤️‍🔥 [${userId}]`, data);
  //     console.groupEnd();
  //   }
  //   return data;
  // }

  async createUserCollection(
    collectionKey: string,
    userId: string = this.fireAuth.currentSessionUser?.uid || ''
  ): Promise<void> {
    const userCollectionRef = collection(
      this.firestore,
      USERS_COL,
      userId,
      collectionKey
    );
    const newDocRef = doc(userCollectionRef); // Creates a new document reference with an autogenerated ID
    return setDoc(newDocRef, {}); // Set an empty object to the document
  }

  // private getSpecificUserInfoDoc(
  //   collectionPath: string,
  //   documentKey: string,
  //   userId: string
  // ): Observable<DocumentData> {
  //   // const userCollectionRef = collection(this.firestore, USERS_COL, userId, collectionPath);
  //   const userCollectionRef = collection(this.firestore, collectionPath);
  //   const userDocRef = doc(userCollectionRef, documentKey);

  //   return from(getDoc(userDocRef)).pipe(
  //     tap((data) => {
  //       if (!environment.production) {
  //         console.groupCollapsed(
  //           `❤️‍🔥 Firestore Streaming [${userDocRef.path}] [getUserDocument] [${userId}]`
  //         );
  //         console.log(data);
  //         console.groupEnd();
  //       }
  //     }),
  //     filter((data) => !!data),
  //     map((data) => data.data() ?? {})
  //   );
  // }

  // getUserCollection<T>(
  //   collectionPath: string,
  //   userId: string = this.fireAuth.currentSessionUser?.uid || ''
  // ): Observable<T[]> {
  //   if (userId === '') {
  //     return this.fireAuth.getUserAuthObservable().pipe(
  //       concatMap((user) => {
  //         return this.getSpecificCollectionRef<T>(collectionPath, user.uid);
  //       })
  //     );
  //   } else {
  //     return this.getSpecificCollectionRef<T>(collectionPath, userId);
  //   }
  // }

  // private getSpecificCollectionRef<T>(
  //   collectionPath: string,
  //   userId: string
  // ): Observable<T[]> {
  //   const collectionRef = collection(
  //     this.firestore,
  //     USERS_COL,
  //     userId,
  //     collectionPath
  //   );
  //   return from(getDocs(collectionRef)).pipe(
  //     map((querySnapshot) => {
  //       const data: T[] = [];
  //       querySnapshot.forEach((doc) => {
  //         const docData = doc.data();
  //         data.push(docData as T);
  //       });
  //       return data;
  //     }),
  //     tap((data) => {
  //       if (!environment.production) {
  //         console.groupCollapsed(
  //           `❤️‍🔥 Firestore Streaming [${collectionRef.path}] [getUserCollection] [${userId}]`
  //         );
  //         console.log(data);
  //         console.groupEnd();
  //       }
  //     })
  //   );
  // }

  /**
   * Only for creating a top level property entry
   * @param collectionPath
   * @param documentKey
   * @param data
   * @param userId
   * @returns
   */
  // async updateCurrentUserDocument<T>(
  //   data: Partial<T>
  // ): Promise<boolean> {
  //   if (this.fireAuth.currentSessionUser == null) {
  //     return new Promise<boolean>((resolve, reject) => { resolve(false) });
  //   }
  //   const collectionRef = collection(this.firestore, USERS_COL);
  //   const usersRef = doc(collectionRef, this.fireAuth.currentSessionUser.uid);

  //   return new Promise<boolean>((resolve, reject) => {
  //     setDoc(usersRef, this.sanitizeObject(data), { merge: true })
  //       .then(() => {
  //         if (!environment.production) {
  //           console.groupCollapsed(
  //             `❤️‍🔥 Firestore Service [${usersRef.path}] [updateUserDocument]`
  //           );
  //           console.log(`❤️‍🔥 [${ usersRef.path }]`, data);
  //           console.groupEnd();
  //         }
  //         resolve(true); // Resolving the Promise with a boolean value indicating success
  //       })
  //       .catch((error: any) => {
  //         console.error('❤️‍🔥 Request failed', error);
  //         resolve(false); // Resolving the Promise with a boolean value indicating failure
  //       });
  //   });
  // }

  /**
   * Patch specific properties and objects as children of the single data object.
   * Keeping as a promise for internal use only
   * @param collectionKey
   * @param documentKey
   * @param data
   * @param userId
   * @returns
   */
  async updateCurrentUserCollectionDocument<T>(
    collectionKey: string,
    documentKey: string,
    data: Partial<T>
  ): Promise<boolean> {
    if (this.fireAuth.currentSessionUser == null) {
      return new Promise<boolean>((resolve, reject) => {
        reject(false);
      });
    }
    const collectionRef = collection(
      this.firestore,
      USERS_COL,
      this.fireAuth.currentSessionUser.uid,
      collectionKey
    );
    const userDocRef = doc(collectionRef, documentKey);

    return new Promise<boolean>((resolve, reject) => {
      setDoc(userDocRef, this.sanitizeObject(data), { merge: true })
        .then(() => {
          if (!environment.production) {
            console.groupCollapsed(
              `❤️‍🔥 Firestore Service [${userDocRef.path}] [updateUserDocument]`
            );
            console.log(`❤️‍🔥 [${documentKey}]`, data);
            console.groupEnd();
          }
          resolve(true); // Resolving the Promise with a boolean value indicating success
        })
        .catch((error: any) => {
          console.error('❤️‍🔥 Request failed', error);
          resolve(false); // Resolving the Promise with a boolean value indicating failure
        });
    });
  }

  // async updateUsersDocumentMap(
  //   collectionPath: string,
  //   documentKey: string,
  //   data: Map<string, string>,
  //   userId: string = this.fireAuth.sessionUser?.uid || ''
  // ): Promise<void> {
  //   const docRef = this.firestore
  //     .collection(USERS_COL)
  //     .doc(userId)
  //     .collection(collectionPath)
  //     .doc(documentKey);
  //   const objMap = Object.fromEntries(data);
  //   await docRef.update(this.sanitizeObject({ structuredScript: objMap }));

  //   if (!environment.production) {
  //     console.groupCollapsed(
  //       `❤️‍🔥 Firestore Service [${collectionPath}] [updateUserDocument]`
  //     );
  //     console.log(`❤️‍🔥 [${userId}]`, data);
  //     console.groupEnd();
  //   }
  // }

  // Observes a single Firestore document
  observeSpecificDocument<T>(
    collectionName: string,
    documentId: string
  ): Observable<T> {
    const collectionRef = collection(this.firestore, collectionName);
    const documentRef = doc(collectionRef, documentId);

    return from(getDoc(documentRef)).pipe(
      map((data) => {
        const docData = data.data() as T;
        const id = data.id;
        return { id, ...docData };
      })
    );
  }

  // Observe a collection of documents
  observeSpecificCollection<T>(
    collectionPath: string,
    queryFn: Query
  ): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionPath);
    const querySnapshot = getDocs(queryFn);

    return from(querySnapshot).pipe(
      map((querySnapshot) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          data.push(docData as T);
        });
        return data;
      }),
      tap((data) => {
        if (!environment.production) {
          console.groupCollapsed(
            `❤️‍🔥 Firestore Streaming [${collectionPath}] [observeCollection]`
          );
          console.table(data);
          console.groupEnd();
        }
      })
    );
  }

  // Creates a new Firestore document using the full path
  createSpecificDocument<T>(collectionName: string, data: T): Promise<boolean> {
    const collectionRef = collection(this.firestore, collectionName);
    const documentRef = addDoc(collectionRef, this.sanitizeObject(data));

    return new Promise<boolean>((resolve, reject) => {
      documentRef
        .then(() => {
          if (!environment.production) {
            console.groupCollapsed(
              `❤️‍🔥 Firestore Service [${collectionRef.path}] [updateUserDocument]`
            );
            console.groupEnd();
          }
          resolve(true); // Resolving the Promise with a boolean value indicating success
        })
        .catch((error: any) => {
          console.error('❤️‍🔥 Request failed', error);
          resolve(false); // Resolving the Promise with a boolean value indicating failure
        });
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
