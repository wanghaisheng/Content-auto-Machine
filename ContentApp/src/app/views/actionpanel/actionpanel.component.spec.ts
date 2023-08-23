import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionpanelComponent } from './actionpanel.component';

describe('ActionpanelComponent', () => {
  let component: ActionpanelComponent;
  let fixture: ComponentFixture<ActionpanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionpanelComponent]
    });
    fixture = TestBed.createComponent(ActionpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
