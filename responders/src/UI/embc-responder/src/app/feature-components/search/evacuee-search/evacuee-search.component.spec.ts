import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacueeSearchComponent } from './evacuee-search.component';

describe('EvacueeSearchComponent', () => {
  let component: EvacueeSearchComponent;
  let fixture: ComponentFixture<EvacueeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
