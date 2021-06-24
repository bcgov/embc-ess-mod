import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCreateEssFileComponent } from './step-create-ess-file.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('StepCreateEssFileComponent', () => {
  let component: StepCreateEssFileComponent;
  let fixture: ComponentFixture<StepCreateEssFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
      declarations: [StepCreateEssFileComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCreateEssFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
