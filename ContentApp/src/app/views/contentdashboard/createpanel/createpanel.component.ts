/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';
import { SelectItem } from 'primeng/api';
import { Meeting } from 'src/app/model/source/zoomrecordings.model';

@Component({
  selector: 'app-createpanel',
  templateUrl: './createpanel.component.html',
  styleUrls: ['./createpanel.component.css']
})
export class CreatepanelComponent implements OnInit, OnChanges {

  @Input() createMode: string = '';
  mode: string = ''

  // models: { name: string, code: string }[] = [
  //   { name: 'Quality', code: 'GPT-4' },
  //   { name: 'Speed', code: 'GPT-3.5turbo' }
  // ];
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
  contentLoading: boolean = false;
  showVideoInfo: boolean = false;

  meetings: Meeting[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: HubDashboardService
  ) { /** */ }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      title: [''],
      url: ['', Validators.pattern(/https?:\/\/.*/)],
      meetingId: ['']
    });

    this.dashboardService.meetingsObservable$.subscribe((meetings) => {
      this.meetings = meetings;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['createMode']) {
      this.mode = changes['createMode'].currentValue;
      if (this.createMode == 'zoom') {
        this.dashboardService.getZoomRecordings();
      }
    }
  }

  submitForContent(model: string = 'gpt-4') {
    if (this.formGroup.valid) {
      this.dashboardService.createContent(
        this.formGroup.value.title,
        this.formGroup.value.url, 
        model
      )
    } else {
      console.log('Form is invalid');
    }
  }
}
