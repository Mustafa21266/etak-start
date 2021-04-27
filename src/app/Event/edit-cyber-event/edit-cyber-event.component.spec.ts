import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCyberEventComponent } from './edit-cyber-event.component';

describe('EditCyberEventComponent', () => {
  let component: EditCyberEventComponent;
  let fixture: ComponentFixture<EditCyberEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCyberEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCyberEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
