import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-restriction-form',
  templateUrl: './restriction-form.component.html',
  styleUrls: ['./restriction-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatRadioModule, NgIf, MatFormFieldModule]
})
export class RestrictionFormComponent {
  @Input() restrictionForm: UntypedFormGroup;

  constructor() {}

  /**
   * Returns the control of the form
   */
  get restrFormControl(): { [key: string]: AbstractControl } {
    return this.restrictionForm.controls;
  }
}
