/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialAuthService } from '../../service/user/socialauth.service';

@Component({
  selector: 'li-redirects',
  templateUrl: './redirects.component.html',
  styleUrls: ['./redirects.component.css']
})
export class LinkedinRedirectComponent {

  linkedInToken: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.linkedInToken = this.route.snapshot.queryParams["code"];
    if (this.linkedInToken !== undefined && this.linkedInToken !== '') {
      this.socialAuthService.getLinkedInAccessToken(this.linkedInToken);
    } 
  }
}
