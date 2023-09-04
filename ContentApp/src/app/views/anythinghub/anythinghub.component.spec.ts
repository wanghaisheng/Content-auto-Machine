/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnythinghubComponent } from './anythinghub.component';

describe('AnythinghubComponent', () => {
  let component: AnythinghubComponent;
  let fixture: ComponentFixture<AnythinghubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnythinghubComponent]
    });
    fixture = TestBed.createComponent(AnythinghubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
