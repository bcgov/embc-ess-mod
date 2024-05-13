import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepNotesComponent } from './step-notes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('StepNotesComponent', () => {
  let component: StepNotesComponent;
  let fixture: ComponentFixture<StepNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StepNotesComponent],
      providers: [provideRouter([])]
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
