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
import { SocialAuthService } from './service/socialauth.service';
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from 'primeng/api';
import { ZOOM_CLIENT_ID } from 'appsecrets';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
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
  
  title = 'Content Machine';
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private socialAuthService: SocialAuthService
  ) {
    
  }

  ngOnInit() {
    this.loggedInObserver$ = this.socialAuthService.isUserLoggedIn();
    // Subscribe to route changes
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get the current route snapshot
        let route = this.activatedRoute.root;
        console.log("🚀 ~ file: app.component.ts:67 ~ AppComponent ~ .subscribe ~ route:", route.children)
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
  }
  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: any[] = []
  ): any[] {
    const label = route.routeConfig ? route.routeConfig.data!['breadcrumb'] : '';
    console.log("🚀 ~ file: app.component.ts:102 ~ AppComponent ~ label:", label)
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

  onAccountsClick() {
    const params = {
      //TODO: move to appsecrets
      client_id: ZOOM_CLIENT_ID,
      redirect_uri: 'http://localhost:4200/zoom-callback',
    };
    window.location.href = `https://zoom.us/oauth/authorize?response_type=code&client_id=${params.client_id}&redirect_uri=${params.redirect_uri}`;
  }

  onLogoutClick() {
    this.confirmationService.confirm({
      message:
        'You are about to log out of the app.  Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have been logged out.',
        });
        this.navigationService.navigateToLogin();
      },
      reject: (type: any) => {
        // switch (type) {
        //     case ConfirmEventType.REJECT:
        //         this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        //         break;
        //     case ConfirmEventType.CANCEL:
        //         this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
        //         break;
        // }
      },
    });
  }
}
