import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepNotesComponent } from './step-notes.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('StepNotesComponent', () => {
  let component: StepNotesComponent;
  let fixture: ComponentFixture<StepNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
