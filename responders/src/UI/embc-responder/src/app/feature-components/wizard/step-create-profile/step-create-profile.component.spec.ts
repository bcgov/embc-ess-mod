import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCreateProfileComponent } from './step-create-profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('StepCreateProfileComponent', () => {
  let component: StepCreateProfileComponent;
  let fixture: ComponentFixture<StepCreateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
      declarations: [StepCreateProfileComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCreateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
