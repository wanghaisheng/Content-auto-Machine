/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FireAuthRepository } from '../repository/database/fireauth.repo';

@Injectable({
  providedIn: 'root',
})
export class NavigationService implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fireAuthRepo: FireAuthRepository
  ) {
    /** */
  }

  ngOnInit() {
    
  }

  navigateToRoot() {
    this.router.navigate(['']);
  }

  navigateToLogin() {
    this.fireAuthRepo.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  navigateToDashboard(type: string) {
    this.router.navigate(['dashboard', type]);
  }

  navigateToTerms(type: string) {
    this.router.navigate(['terms', type]);
  }

  navigateToSettings() {
    this.router.navigate(['settings']);
  }

  navigateToLibrary() {
    this.router.navigate(['library']);
  }

  // navigateToExtractDetails(id: string = '') {
  //   if (id === '') {
  //     this.router.navigate(['maker/copycat/details']);
  //   } else {
  //     // localStorage.setItem('detailsId', id); for page refresh mid-edit
  //     this.router.navigate(['maker/copycat/details', id]);
  //   }
  // }
}
