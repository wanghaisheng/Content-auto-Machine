import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinpostComponent } from './linkedinpost.component';

describe('LinkedinpostComponent', () => {
  let component: LinkedinpostComponent;
  let fixture: ComponentFixture<LinkedinpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedinpostComponent]
    });
    fixture = TestBed.createComponent(LinkedinpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
