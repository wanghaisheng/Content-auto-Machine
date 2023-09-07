/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDashboardComponent } from './contentdashboard.component';

describe('ContentdashboardComponent', () => {
  let component: ContentDashboardComponent;
  let fixture: ComponentFixture<ContentDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentDashboardComponent]
    });
    fixture = TestBed.createComponent(ContentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
