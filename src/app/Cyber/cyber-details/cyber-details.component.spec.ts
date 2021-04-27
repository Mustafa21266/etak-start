import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberDetailsComponent } from './cyber-details.component';

describe('CyberDetailsComponent', () => {
  let component: CyberDetailsComponent;
  let fixture: ComponentFixture<CyberDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
