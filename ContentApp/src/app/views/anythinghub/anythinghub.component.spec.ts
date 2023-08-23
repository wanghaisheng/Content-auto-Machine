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
