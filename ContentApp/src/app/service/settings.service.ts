/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */
import { Injectable } from "@angular/core";
import { FirestoreRepository } from "../repository/database/firestore.repo";
import { Persona } from "../model/user/persona.model";
import { Subject, catchError, map, tap } from "rxjs";
import { AdminRepository } from "../repository/admin.repo";

const PERSONA_KEY = 'persona'

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  private loadingSubject = new Subject<boolean>();
  loadingObservable$ = this.loadingSubject.asObservable();
  
  private errorSubject = new Subject<string>();
  errorObservable$ = this.errorSubject.asObservable();
  
  private personaSubject = new Subject<Persona>();
  personaObservable$ = this.personaSubject.asObservable();

  constructor(
    private firestoreRepo: FirestoreRepository,
    private adminRepo: AdminRepository
  ) {
    /** */
  }

  public storePersonaSettings(
    persona: string,
    audience: string,
    style: string,
    values: string,
    voice: string,
    context: string,
  ) {
    this.loadingSubject.next(true);
    return this.firestoreRepo.updateCurrentUserDocumentObj<Persona>(
      PERSONA_KEY,
      {
        persona: persona,
        audience: audience,
        style: style,
        values: values,
        voice: voice,
        context: context
      },
    ).pipe(
      tap((response) => this.adminRepo.updateOnboardingStatus(false)),
      map((response) => {
        this.loadingSubject.next(false);
        this.personaSubject.next(response);
        return response
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error);
        return error;
      })
    );
  }

  getPersonaSettings() {
    this.firestoreRepo.getDocumentAsUser<Persona>(
      PERSONA_KEY
    ).subscribe({
      next: (response) => {
        if (response !== undefined) {
          this.loadingSubject.next(false);
          this.personaSubject.next(response);
        } 
      },
      error: (error) => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error);
      }
    });
  }

  updateOnboardingStatus(hasCompleted: boolean) {
    this.adminRepo.updateOnboardingStatus(hasCompleted);
  }
}
