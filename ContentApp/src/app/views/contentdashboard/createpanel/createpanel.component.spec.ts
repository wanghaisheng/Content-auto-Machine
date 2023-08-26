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
