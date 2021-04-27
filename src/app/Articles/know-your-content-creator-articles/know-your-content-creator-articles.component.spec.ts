import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowYourContentCreatorArticlesComponent } from './know-your-content-creator-articles.component';

describe('KnowYourContentCreatorComponent', () => {
  let component: KnowYourContentCreatorArticlesComponent;
  let fixture: ComponentFixture<KnowYourContentCreatorArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowYourContentCreatorArticlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowYourContentCreatorArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
