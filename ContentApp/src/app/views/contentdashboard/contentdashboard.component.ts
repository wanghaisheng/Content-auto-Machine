/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';

@Component({
  selector: 'app-contentdashboard',
  templateUrl: './contentdashboard.component.html',
  styleUrls: ['./contentdashboard.component.css']
})
export class ContentDashboardComponent implements OnInit, OnChanges {
 
  panelCreateMode = '';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private dashboardService: HubDashboardService
  ) { /** */ }

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      if (segments.length > 0) {
        const segment = segments[segments.length - 1].path;
        this.panelCreateMode = segment;
      }
    })
    this.dashboardService.errorObservable$.subscribe((message) => {
      this.receiveErrorMessage(message);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
      /** */
  }

  receiveErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  receiveInfoMessage(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: message,
    });
  }
}
