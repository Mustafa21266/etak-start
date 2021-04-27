import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCyberComponent } from './delete-cyber.component';

describe('DeleteCyberComponent', () => {
  let component: DeleteCyberComponent;
  let fixture: ComponentFixture<DeleteCyberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCyberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCyberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
