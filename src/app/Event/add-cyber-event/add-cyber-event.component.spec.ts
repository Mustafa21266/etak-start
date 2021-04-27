import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCyberEventComponent } from './add-cyber-event.component';

describe('AddCyberEventComponent', () => {
  let component: AddCyberEventComponent;
  let fixture: ComponentFixture<AddCyberEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCyberEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCyberEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
