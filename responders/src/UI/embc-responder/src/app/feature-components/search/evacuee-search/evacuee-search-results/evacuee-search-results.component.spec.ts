import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacueeSearchResultsComponent } from './evacuee-search-results.component';

describe('EvacueeSearchResultsComponent', () => {
  let component: EvacueeSearchResultsComponent;
  let fixture: ComponentFixture<EvacueeSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvacueeSearchResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
