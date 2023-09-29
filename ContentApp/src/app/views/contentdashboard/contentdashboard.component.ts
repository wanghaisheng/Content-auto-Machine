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
export class ContentDashboardComponent implements OnInit {
 
  panelCreateMode = '';
  panelMediaMode = '';
  title = '';

  constructor(
    private route: ActivatedRoute
  ) { /** */ }

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      if (segments.length > 0) {
        const segment = segments[segments.length - 1].path;
        const splitSegments = segment.split('_');

        splitSegments.forEach((word, index) => {
          if (index == 0) {
            this.title += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
          } else if (index == 2) {
            this.title += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
          } else {
            this.title += word + ' ';
          }
        });

        this.panelCreateMode = segment;
        this.panelMediaMode = splitSegments[2];
        console.log("🚀 ~ file: contentdashboard.component.ts:47 ~ ContentDashboardComponent ~ this.route.url.subscribe ~ panelMediaMode:", this.panelMediaMode)
      }
    })
  
  }
}
