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
import { Observable, tap } from 'rxjs';
import { MessengerService } from 'src/app/service/messenger.service';
import { Content } from 'src/app/model/content/content.model';

@Component({
  selector: 'app-createpanel',
  templateUrl: './createpanel.component.html',
  styleUrls: ['./createpanel.component.css']
})
export class CreatepanelComponent implements OnInit, AfterContentInit {

  @Input() createMode: string = '';

  mode: string = ''

  contentLoading$!: Observable<boolean>;

  items = [
    { name: '🔐 Yoni Brand Engine™', key: 'yoni', description: 'Our secret sauce that no one else has. Tuned to your brand.' },
    { name: 'General', key: 'gpt-4', description: 'Your typical AI generated text. Gets the job done and uses less credits.' },
    { name: 'Speed', key: 'gpt-3.5-turbo', description: 'For those in a hurry. No need to use this if you want to grow your business.'}
];

  formGroup!: FormGroup;
  showVideoInfo: boolean = false;
  disabledState = false;

  meetings: Meeting[] | undefined;
  selectedMeeting!:  Meeting;

  title = ''
  url = ''

  detailsTitle = ''
  detailsDescription = ''
  detailsThumbnail = ''
  detailsLengthMins = ''
  detailsViewCount = ''

  selectedItem = this.items[0];

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
      meetingId: [],
      selectedModel: [this.items[0]]
    });

    this.hubDashboardService.meetingsObservable$.subscribe((meetings) => {
      this.meetings = meetings;
    })
    this.hubDashboardService.errorObservable$.subscribe((error) => {
      this.disabledState = false;
    });
    this.hubDashboardService.contentObservable$.subscribe((contentComplete: Content) => {
      this.disabledState = false;
      this.formGroup.patchValue({ 'title': contentComplete.title.replace(/"/g, '') })
    })
    this.hubDashboardService.videoDetailsObservable$.subscribe((videoDetails) => {
      this.showVideoInfo = true;

      this.detailsTitle = videoDetails.title;
      this.detailsDescription = videoDetails.description;
      this.detailsLengthMins = (videoDetails.lengthSeconds / 60).toFixed(2).replace('.', ':');
      this.detailsViewCount = videoDetails.viewCount.toLocaleString();

      const thumbnails = videoDetails.thumbnails;
      if (thumbnails.length > 0) {
        this.detailsThumbnail = thumbnails[thumbnails.length - 1].url;
      }
    });
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

  submitForContent() {
    if (this.selectedItem === undefined) {
      this.messengerService.setErrorMessage('Please pick your AI');
      return;
    }
    if (this.selectedItem.key === 'yoni') {
      this.messengerService.setErrorMessage('Brand Engine only available for premium members.');
      return;
    }

    this.formGroup.patchValue({ 'title': '' })
    this.disabledState = true;

    if (this.createMode.includes('zoom')) {
      this.hubDashboardService.createZoomContent(
        this.formGroup.value.title,
        this.selectedMeeting.id,
        this.selectedItem?.key ?? '',
        this.createMode
        )
    } else if (this.createMode.includes('youtube')) {
      if (this.formGroup.valid) {
        this.hubDashboardService.createYoutubeContent(
          this.formGroup.value.title,
          this.formGroup.value.url, 
          this.selectedItem?.key ?? '',
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
