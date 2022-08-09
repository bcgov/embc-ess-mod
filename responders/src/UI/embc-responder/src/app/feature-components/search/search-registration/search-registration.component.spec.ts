import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRegistrationComponent } from './search-registration.component';

describe('SearchRegistrationComponent', () => {
  let component: SearchRegistrationComponent;
  let fixture: ComponentFixture<SearchRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchRegistrationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
