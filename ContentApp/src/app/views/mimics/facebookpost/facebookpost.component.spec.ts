import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookpostComponent } from './facebookpost.component';

describe('FacebookpostComponent', () => {
  let component: FacebookpostComponent;
  let fixture: ComponentFixture<FacebookpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacebookpostComponent]
    });
    fixture = TestBed.createComponent(FacebookpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
