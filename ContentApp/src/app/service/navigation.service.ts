/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FireAuthRepository } from '../repository/database/fireauth.repo';
import { MenuItem } from 'primeng/api';
import { Observable, Subject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService implements OnInit {

  breadcrumbData: Subject<MenuItem[]> = new Subject<MenuItem[]>();

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

  // navigateToExtractDetails(id: string = '') {
  //   if (id === '') {
  //     this.router.navigate(['maker/copycat/details']);
  //   } else {
  //     // localStorage.setItem('detailsId', id); for page refresh mid-edit
  //     this.router.navigate(['maker/copycat/details', id]);
  //   }
  // }

  getBreadcrumbData(): Observable<MenuItem[]> {
    return this.breadcrumbData.asObservable();
  }

  setBreadcrumbData(data: { label: string; url: string }[]) {
    this.breadcrumbData.next(data);
  }

  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: any[] = []
  ): any[] {
    const label = route.routeConfig ? route.routeConfig.data!['breadcrumb'] : '';
    const path = route.routeConfig ? route.routeConfig.path : '';

    // Don't include empty labels
    const nextUrl = `${url}${path}/`;
    const breadcrumb = {
      label,
      url: nextUrl,
    };

    const newBreadcrumbs = breadcrumb.label
      ? [...breadcrumbs, breadcrumb]
      : [...breadcrumbs];
    if (route.firstChild) {
      return this.buildBreadcrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
