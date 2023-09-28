/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { AfterContentInit, Component, ElementRef, OnInit, QueryList, SecurityContext, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ZOOM_CLIENT_ID } from 'appsecrets';
import * as RecordRTC from 'recordrtc';
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

  // Declare Record OBJ
  record: RecordRTC.StereoAudioRecorder | undefined;
  
  // URL of Blob
  url: string = '';
  
  recording = false;
  promptForZoom: boolean = false;
  promptOnboarding: boolean = false;
  showVoiceDialog = false;

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
    private messengerService: MessengerService,
    private domSanitizer: DomSanitizer
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
    } else if (generator_type.includes('voice')) {
      this.showVoiceDialog = true;
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

  sanitize(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  /**
   * Start recording.
   */
  initiateRecording() {
    this.recording = true;
    const mediaConstraints: MediaStreamConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(
      (stream) => this.successCallback(stream),
      (error) => this.errorCallback(error)
    );
  }

  /**
   * Will be called automatically.
   */
  successCallback(stream: MediaStream) {
    const options: RecordRTC.Options = {
      type: "audio",
      numberOfAudioChannels: 1,
      sampleRate: 16000,
    };
    // Start Actual Recording
    this.record = new RecordRTC.StereoAudioRecorder(stream, options);
    this.record.record();
  }

  /**
   * Stop recording.
   */
  stopRecording() {
    this.recording = false;
    this.record?.stop(this.processRecording.bind(this));
  }

  /**
   * Process recording: Do whatever you want with the blob.
   */
  processRecording(blob: Blob) {
    const safeUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    this.url = this.domSanitizer.sanitize(SecurityContext.URL, safeUrl) ?? '';
    console.log("blob", blob);
    console.log("url", this.url);
    //TODO
  }

  /**
   * Process Error.
   */
  errorCallback(error: any) {
    this.messengerService.setErrorMessage('Can not record audio in your browser');
  }
}
