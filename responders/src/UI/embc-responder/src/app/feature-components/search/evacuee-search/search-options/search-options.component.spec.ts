import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computeInterfaceToken } from 'src/app/app.module';

import { SearchOptionsComponent } from './search-options.component';

describe('SearchOptionsComponent', () => {
  let component: SearchOptionsComponent;
  let fixture: ComponentFixture<SearchOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchOptionsComponent],
      providers: [{ provide: computeInterfaceToken, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
