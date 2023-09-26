/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { AfterContentInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ZOOM_CLIENT_ID } from 'appsecrets';
import { Card } from 'primeng/card';
import { Generators } from 'src/app/model/admin/generators.model'
import { HubDashboardService } from 'src/app/service/hubdashboard.service';
import { MessengerService } from 'src/app/service/messenger.service';
import { NavigationService } from 'src/app/service/navigation.service';
import { SocialAuthService } from 'src/app/service/user/socialauth.service';

@Component({
  selector: 'app-anythinghub',
  templateUrl: './anythinghub.component.html',
  styleUrls: ['./anythinghub.component.css']
})
export class AnythinghubComponent implements OnInit {

  promptForZoom: boolean = false;
  promptOnboarding: boolean = false;

  generatorsList: {
    header: string;
    items: {
      type: string;
      title: string;
      description: string;
      prompt: string;
    }[]
  }[] = [];

  constructor(
    private navigationService: NavigationService,
    private hubDashboardService: HubDashboardService,
    private socialAuthService: SocialAuthService,
    private messengerService: MessengerService
  ) { /** */ }

  ngOnInit(): void {
    this.hubDashboardService.getOnboardingStatus().subscribe({
      next: (showOnboarding) => {
        this.promptOnboarding = showOnboarding;
      }
    });
    this.hubDashboardService.generatorsListObservable$.subscribe((genrators: {
      header: string;
      items: {
        type: string;
        title: string;
        description: string;
        prompt: string;
      }[];
    }[]) => this.generatorsList = genrators
    );
    this.hubDashboardService.errorObservable$.subscribe((error: string) => {
      console.log(error);
    });
    //Kickoff
    this.hubDashboardService.getHubGenerators();
    this.socialAuthService.userSocialAccountsObservable$.subscribe({
      next: ((accounts) => {
        accounts.forEach((account) => {
          this.promptForZoom = !account['zoom'];
        });
      })
    });
  }
  
  itemClick(generator_type: string) {
    if (generator_type.includes('zoom') && this.promptForZoom) {
      this.messengerService.setErrorMessage('Please connect your Zoom account to use this feature.');
    } else {
      this.navigationService.navigateToDashboard(generator_type)
    }
  }

  onZoomConnectClick() {
    const params = {
      //TODO: move to appsecrets
      client_id: ZOOM_CLIENT_ID,
      redirect_uri: 'http://localhost:4200/zoom-callback',
    };
    window.location.href = `https://zoom.us/oauth/authorize?response_type=code&client_id=${params.client_id}&redirect_uri=${params.redirect_uri}`;
  }

  onSettingsClick() {
    this.navigationService.navigateToSettings();
  }
}
