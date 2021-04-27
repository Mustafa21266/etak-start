import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletePasswordResetComponent } from './complete-password-reset.component';

describe('CompletePasswordResetComponent', () => {
  let component: CompletePasswordResetComponent;
  let fixture: ComponentFixture<CompletePasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletePasswordResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletePasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
