import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepNotesComponent } from './step-notes.component';

describe('StepNotesComponent', () => {
  let component: StepNotesComponent;
  let fixture: ComponentFixture<StepNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepNotesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
