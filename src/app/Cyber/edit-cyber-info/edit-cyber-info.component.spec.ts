import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCyberComponent } from './edit-cyber.component';

describe('EditCyberComponent', () => {
  let component: EditCyberComponent;
  let fixture: ComponentFixture<EditCyberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCyberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCyberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
