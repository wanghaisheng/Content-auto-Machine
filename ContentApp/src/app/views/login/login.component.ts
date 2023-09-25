/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../service/user/session.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  errorMessage = '';
  hasError = false;
  isLoading = false;

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.sessionService.getErrorObserver().subscribe((error) => {
      alert(error);
    });
  }

  onSubmit() {
    this.sessionService.verifyEmailWithGoogle();
  }

  uiShownCallback() {
    /** */
  }
}
