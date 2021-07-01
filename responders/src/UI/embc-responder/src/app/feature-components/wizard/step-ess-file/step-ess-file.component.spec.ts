import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEssFileComponent } from './step-ess-file.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('StepEssFileComponent', () => {
  let component: StepEssFileComponent;
  let fixture: ComponentFixture<StepEssFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
      declarations: [StepEssFileComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepEssFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
