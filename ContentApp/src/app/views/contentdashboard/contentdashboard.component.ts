/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contentdashboard',
  templateUrl: './contentdashboard.component.html',
  styleUrls: ['./contentdashboard.component.css']
})
export class ContentDashboardComponent implements OnInit {
 
  panelCreateMode = '';

  constructor(
    private route: ActivatedRoute,
  ) { /** */ }

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      console.log("🚀 ~ file: contentdashboard.component.ts:27 ~ ContentDashboardComponent ~ this.route.url.subscribe ~ segments:", segments)
      if (segments.length > 0) {
        const segment = segments[segments.length - 1].path;
        console.log("🚀 ~ file: contentdashboard.component.ts:30 ~ ContentDashboardComponent ~ this.route.url.subscribe ~ segment:", segment)
        if (segment.includes('youtube')) {
          this.panelCreateMode = 'youtube';
        } else if (segment.includes('zoom')) {
          this.panelCreateMode = 'zoom';
        } else {
          throw new Error('Invalid route');
        }
      }
    })
  }
}
