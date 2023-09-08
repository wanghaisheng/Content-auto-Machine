/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialAuthService } from '../../service/socialauth.service';

@Component({
  selector: 'zoom-redirects',
  templateUrl: './redirects.component.html',
  styleUrls: ['./redirects.component.css']
})
export class ZoomRedirectComponent {


  constructor(
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    const zoomCode = this.route.snapshot.queryParams["code"];
    if (zoomCode !== undefined && zoomCode !== '') {
      this.socialAuthService.getZoomAccessToken(zoomCode);
    } 
  }
}
