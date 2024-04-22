import { Component, Input } from '@angular/core';
import { UntypedFormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-other-address',
  templateUrl: './other-address.component.html',
  styleUrls: ['./other-address.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule]
})
export class OtherAddressComponent {
  @Input() addressForm: UntypedFormGroup;

  constructor() {}

  get addressFormControl(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }
}
