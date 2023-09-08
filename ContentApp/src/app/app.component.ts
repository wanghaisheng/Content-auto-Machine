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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Content Machine';
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' }

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
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private socialAuthService: SocialAuthService
  ) {
    
  }

  ngOnInit() {
    // Subscribe to breadcrumb data changes
    this.navigationService.getBreadcrumbData().subscribe((data) => {
      console.log("🚀 ~ file: app.component.ts:44 ~ AppComponent ~ this.navigationService.getBreadcrumbData ~ data:", data)
      this.items = data;
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

  onCalendarClick() {
    this.navigationService.navigateToRoot();
  }

  onAccountsClick() {
    const params = {
      //TODO: move to appsecrets
      client_id: 'v6c4slYJRDGzpwoZY8h_Nw',
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
