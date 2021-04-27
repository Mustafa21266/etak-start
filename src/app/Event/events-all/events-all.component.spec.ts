import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsAllComponent } from './events-all.component';

describe('EventsAllComponent', () => {
  let component: EventsAllComponent;
  let fixture: ComponentFixture<EventsAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
