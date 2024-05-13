import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-custom-gst-field',
  templateUrl: './custom-gst-field.component.html',
  styleUrls: ['./custom-gst-field.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError]
})
export class CustomGstFieldComponent {
  @Input() gstFormGroup: UntypedFormGroup;

  get gstFormControl(): { [key: string]: AbstractControl } {
    return this.gstFormGroup.controls;
  }
}
