import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNoteSearchComponent } from './case-note-search.component';

describe('CaseNoteSearchComponent', () => {
  let component: CaseNoteSearchComponent;
  let fixture: ComponentFixture<CaseNoteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNoteSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseNoteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
