import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSlideshowComponent } from './app-slideshow.component';

describe('AppSlideshowComponent', () => {
  let component: AppSlideshowComponent;
  let fixture: ComponentFixture<AppSlideshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSlideshowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
