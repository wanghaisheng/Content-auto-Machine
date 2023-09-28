import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovepanelComponent } from './improvepanel.component';

describe('ImprovepanelComponent', () => {
  let component: ImprovepanelComponent;
  let fixture: ComponentFixture<ImprovepanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImprovepanelComponent]
    });
    fixture = TestBed.createComponent(ImprovepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
