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
