import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRegistartionComponent } from './search-registartion.component';

describe('SearchRegistartionComponent', () => {
  let component: SearchRegistartionComponent;
  let fixture: ComponentFixture<SearchRegistartionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchRegistartionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRegistartionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
