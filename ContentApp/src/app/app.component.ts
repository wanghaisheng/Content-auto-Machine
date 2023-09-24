/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationService } from './service/navigation.service';
import { SocialAuthService } from './service/user/socialauth.service';
import { MessengerService } from './service/messenger.service';
import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, filter } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  loggedInObserver$?: Observable<boolean>;

  breadcrumbData: Subject<MenuItem[]> = new Subject<MenuItem[]>();
  
  title = 'Yoni AI';
  items: MenuItem[] = [];
  home: MenuItem = { 
    label: ' Home',
    icon: 'pi pi-home', 
    routerLink: '/' 
  }

  /**
   * 0 = twitter
   * 1 = facebook
   * 2 = medium
   * 3 = youtube
   * 4 = linkedin
   */
  focusedAccount = 0;
  settingsVisible = false;
  avatarUrl = ''
  hasError = false; //this needs to be updated authenticating with zoom
  inputErrorText = 'You have not authenticated with Zoom. Start there to get the most out of our platform.';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private messengerService: MessengerService,
    private navigationService: NavigationService,
    private socialAuthService: SocialAuthService
  ) {
    /** */
  }

  ngOnInit() {
    this.loggedInObserver$ = this.socialAuthService.isUserLoggedIn();
    // Subscribe to route changes
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get the current route snapshot
        let route = this.activatedRoute.root;
        while (route.firstChild) {
          route = route.firstChild;
        }

        // Build breadcrumb data based on child route hierarchy
        const breadcrumbData = this.buildBreadcrumb(
          route = route
        );
        this.items = breadcrumbData;
      });
    this.socialAuthService.getFacebookAuthObservable$.subscribe((success) => {
      if (success) {
        this.settingsVisible = true;
        this.focusedAccount = 1;
      }
    });
    this.socialAuthService.getLinkedinAuthObservable$.subscribe((success) => {
      if (success) {
        this.settingsVisible = true;
        this.focusedAccount = 4;
      }
    });
    this.socialAuthService.getZoomAuthObservable$.subscribe((success) => {
      if (success) {
        this.settingsVisible = true;
      }
    });
    this.socialAuthService.userAccountObservable$.subscribe((user) => {
      if (user) {
        this.avatarUrl = user.photoURL ?? '';
      }
    });
    this.messengerService.errorMessageObservable$.subscribe((message) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
      });
    });
    this.messengerService.infoMessageObservable$.subscribe((message) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmed',
        detail: message,
      });
    });
  }

  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: any[] = []
  ): any[] {
    const label = route.routeConfig ? route.routeConfig.data!['breadcrumb'] : '';
    const path = route.routeConfig ? route.routeConfig.path : '';

    if (label === 'login' || label === 'facebook-callback' || label === 'linkedin-callback' || label === 'zoom-callback' || label === 'Homebase') {
      return breadcrumbs;
    }

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

  onCalendarClick() {
    this.navigationService.navigateToRoot();
  }

  onFolderClick() {
    this.navigationService.navigateToLibrary();
  }

  onSettingsClick() {
    this.navigationService.navigateToSettings();
  }

  onTermsClick(type: string) {
    this.navigationService.navigateToTerms(type);
  }
}
