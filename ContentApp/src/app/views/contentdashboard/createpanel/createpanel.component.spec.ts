/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepanelComponent } from './createpanel.component';

describe('CreatepanelComponent', () => {
  let component: CreatepanelComponent;
  let fixture: ComponentFixture<CreatepanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatepanelComponent]
    });
    fixture = TestBed.createComponent(CreatepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
