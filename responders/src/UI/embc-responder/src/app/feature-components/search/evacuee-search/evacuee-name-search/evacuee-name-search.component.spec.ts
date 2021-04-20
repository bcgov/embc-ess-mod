import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacueeNameSearchComponent } from './evacuee-name-search.component';

describe('EvacueeNameSearchComponent', () => {
  let component: EvacueeNameSearchComponent;
  let fixture: ComponentFixture<EvacueeNameSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvacueeNameSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeNameSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
