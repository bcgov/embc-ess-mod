import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEvacueeProfileComponent } from './step-evacuee-profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('StepEvacueeProfileComponent', () => {
  let component: StepEvacueeProfileComponent;
  let fixture: ComponentFixture<StepEvacueeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
      declarations: [StepEvacueeProfileComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepEvacueeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
