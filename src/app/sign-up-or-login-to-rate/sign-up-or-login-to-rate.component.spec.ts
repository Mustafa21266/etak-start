import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpOrLoginToRateComponent } from './sign-up-or-login-to-rate.component';

describe('SignUpOrLoginToRateComponent', () => {
  let component: SignUpOrLoginToRateComponent;
  let fixture: ComponentFixture<SignUpOrLoginToRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpOrLoginToRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpOrLoginToRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
