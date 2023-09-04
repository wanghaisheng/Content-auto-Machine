/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccounthubComponent } from './accounthub.component';

describe('AccounthubComponent', () => {
  let component: AccounthubComponent;
  let fixture: ComponentFixture<AccounthubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccounthubComponent]
    });
    fixture = TestBed.createComponent(AccounthubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
