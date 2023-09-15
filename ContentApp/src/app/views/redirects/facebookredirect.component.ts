/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialAuthService } from '../../service/user/socialauth.service';

@Component({
  selector: 'fb-redirects',
  templateUrl: './redirects.component.html',
  styleUrls: ['./redirects.component.css']
})
export class FacebookRedirectComponent implements OnInit {

  facebookToken: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.facebookToken = this.route.snapshot.queryParams["code"];
    if (this.facebookToken !== undefined && this.facebookToken !== '') {
      // this.socialAuthService.signInWithFacebook(this.facebookToken);
    } 
  }

}
