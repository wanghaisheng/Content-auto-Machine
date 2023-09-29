import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitternpostComponent } from './twitternpost.component';

describe('TwitternpostComponent', () => {
  let component: TwitternpostComponent;
  let fixture: ComponentFixture<TwitternpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwitternpostComponent]
    });
    fixture = TestBed.createComponent(TwitternpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
