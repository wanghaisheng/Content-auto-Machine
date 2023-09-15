/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {

  private errorMessageSubject = new Subject<string>();
  errorMessageObservable$ = this.errorMessageSubject.asObservable();
  
  private infoMessageSubject = new Subject<string>();
  infoMessageObservable$ = this.infoMessageSubject.asObservable();

  constructor() { /** */ }

  setErrorMessage(message: string) {
    this.errorMessageSubject.next(message);
  }

  setInfoMessage(message: string) {
    this.infoMessageSubject.next(message);
  }
}

