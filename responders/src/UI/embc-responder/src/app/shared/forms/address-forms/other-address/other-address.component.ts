import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-other-address',
  templateUrl: './other-address.component.html',
  styleUrls: ['./other-address.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError]
})
export class OtherAddressComponent {
  @Input() addressForm: UntypedFormGroup;

  get addressFormControl(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }
}
