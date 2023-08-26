import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentpanelComponent } from './contentpanel.component';

describe('ContentpanelComponent', () => {
  let component: ContentpanelComponent;
  let fixture: ComponentFixture<ContentpanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentpanelComponent]
    });
    fixture = TestBed.createComponent(ContentpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
