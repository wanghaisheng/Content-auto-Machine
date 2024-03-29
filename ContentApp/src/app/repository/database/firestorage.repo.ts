/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import {
  getDownloadURL,
  StorageReference,
} from 'firebase/storage';
import { Injectable } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';
import { FirebaseStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageRepository {

  constructor(
    // private storage: FirebaseStorage
  ) {}

  // getSampleVoices(): Observable<{ name: string, sampleUrl: string }[]> {
  //   const language = this.translate.currentLang;
  //   let voicesSampleRef = this.storage.ref('voice_samples').child(language);
  //   return from(voicesSampleRef.listAll()).pipe(
  //     map(list => {
  //       const urlMap: { name: string, sampleUrl: string }[] = [];
  //       list.items.forEach(itemRef => {
  //         itemRef.getDownloadURL().then(url => {
  //           urlMap.push({
  //             name: itemRef.name.replace('.mp3', ''), 
  //             sampleUrl: url
  //           });
  //         });
  //       });
  //       return urlMap;
  //     })
  //   );
  // }

  getDownloadURL(ref: StorageReference): Observable<string> {
    return from(getDownloadURL(ref)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        return url;
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
          default:
            return 'Something went wrong getting url';
        }
        return '';
      }));
  }
}
