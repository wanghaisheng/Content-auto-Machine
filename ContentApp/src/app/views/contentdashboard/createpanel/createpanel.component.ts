/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';
import { SelectItem } from 'primeng/api';
import { Meeting } from 'src/app/model/source/zoomrecordings.model';
import { Observable } from 'rxjs';
import { NgIfContext } from '@angular/common';

@Component({
  selector: 'app-createpanel',
  templateUrl: './createpanel.component.html',
  styleUrls: ['./createpanel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatepanelComponent implements OnInit, AfterContentInit {

  @Input() createMode: string = '';
  mode: string = ''

  items = [
    {
        label: 'Quality',
        icon: 'pi pi-refresh',
        command: () => {
            this.submitForContent();
        }
    },
    {
        label: 'Speed',
        icon: 'pi pi-times',
        command: () => {
            this.submitForContent('gpt-3.5turbo');
        }
    },
    { separator: true },
    { label: 'Learn how this works', icon: 'pi pi-question-circle', routerLink: ['/setup'] }
];

  formGroup!: FormGroup;
  contentLoading$!: Observable<boolean>;
  showVideoInfo: boolean = false;

  meetings: Meeting[] | undefined;
  selectedMeeting!:  Meeting;

  contentLoaded!: TemplateRef<NgIfContext<boolean|null>>|null;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private dashboardService: HubDashboardService
  ) { /** */ }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      title: [''],
      url: ['', Validators.pattern(/https?:\/\/.*/)],
      meetingId: []
    });

    this.dashboardService.meetingsObservable$.subscribe((meetings) => {
      console.log("🚀 ~ file: createpanel.component.ts:65 ~ CreatepanelComponent ~ this.dashboardService.meetingsObservable$.subscribe ~ meetings:", meetings)
      this.meetings = meetings;
    })
    
    this.contentLoading$ = this.dashboardService.loadingObservable$;
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    if (this.createMode.includes('zoom')) {
      this.dashboardService.getZoomMeetings();
    } 
  } 

  ngAfterViewInit(): void {
    this.changeDetectorRef.markForCheck();
  }

  submitForContent(model: string = 'gpt-4') {
    // if (this.formGroup.valid) {
      if (this.createMode.includes('zoom')) {
        this.dashboardService.createZoomContent(
          this.formGroup.value.title,
          this.selectedMeeting.id,
          model,
          this.createMode
        )
      } else {
        this.dashboardService.createYoutubeContent(
          this.formGroup.value.title,
          this.formGroup.value.url, 
          model
        )
      }
    // } else {
    //   console.log('Form is invalid');
    // }
  }
}
