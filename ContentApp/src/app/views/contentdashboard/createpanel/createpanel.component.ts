/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';
import { Meeting } from 'src/app/model/source/zoomrecordings.model';
import { Observable } from 'rxjs';
import { MessengerService } from 'src/app/service/messenger.service';
import { Content } from 'src/app/model/content/content.model';

@Component({
  selector: 'app-createpanel',
  templateUrl: './createpanel.component.html',
  styleUrls: ['./createpanel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatepanelComponent implements OnInit, AfterContentInit {

  @Input() createMode: string = '';
  mode: string = ''

  contentLoading$!: Observable<boolean>;

  items = [
    { 
      label: 'Quality', 
      icon: 'pi pi-refresh', 
      command: () => { this.submitForContent('ft:gpt-3.5-turbo-0613:personal:adobot:7yg5GA9Q'); }
    },
    { 
      label: 'Speed', 
      icon: 'pi pi-times', 
      command: () => { this.submitForContent('gpt-3.5turbo'); }
    },
    { separator: true },
    { 
      label: 'Learn how this works', 
      icon: 'pi pi-question-circle', 
      routerLink: ['/setup'] 
    }
];

  formGroup!: FormGroup;
  showVideoInfo: boolean = false;

  meetings: Meeting[] | undefined;
  selectedMeeting!:  Meeting;

  title = ''
  url = ''

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private hubDashboardService: HubDashboardService,
    private messengerService: MessengerService
  ) { /** */ }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      title: [''],
      url: ['', Validators.pattern(/https?:\/\/.*/)],
      meetingId: []
    });

    this.hubDashboardService.meetingsObservable$.subscribe((meetings) => {
      this.meetings = meetings;
    })
    this.hubDashboardService.contentObservable$.subscribe((contentComplete: Content) => {
      this.formGroup.patchValue({ 'title': contentComplete.title })
    })
    
    this.contentLoading$ = this.hubDashboardService.creteLoadingObservable$;
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    if (this.createMode.includes('zoom')) {
      this.hubDashboardService.getZoomMeetings();
    } 
  } 

  ngAfterViewInit(): void {
    this.changeDetectorRef.markForCheck();
  }

  submitForContent(model: string) {
    if (this.createMode.includes('zoom')) {
      this.hubDashboardService.createZoomContent(
        this.formGroup.value.title,
        this.selectedMeeting.id,
        model,
        this.createMode
        )
    } else if (this.createMode.includes('youtube')) {
      if (this.formGroup.valid) {
        this.hubDashboardService.createYoutubeContent(
          this.formGroup.value.title,
          this.formGroup.value.url, 
          model,
          this.createMode
        )
      } else {
        this.messengerService.setErrorMessage('Please enter a valid YouTube URL');
      }
    } else {
      this.messengerService.setErrorMessage('Something went wrong. Please try again later.');
    }
  }
}
