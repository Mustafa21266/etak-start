import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CybersAllComponent } from './cybers-all.component';

describe('CybersAllComponent', () => {
  let component: CybersAllComponent;
  let fixture: ComponentFixture<CybersAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CybersAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CybersAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
