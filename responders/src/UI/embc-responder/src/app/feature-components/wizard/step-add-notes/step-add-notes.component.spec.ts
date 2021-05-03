import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAddNotesComponent } from './step-add-notes.component';

describe('StepAddNotesComponent', () => {
  let component: StepAddNotesComponent;
  let fixture: ComponentFixture<StepAddNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepAddNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepAddNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
