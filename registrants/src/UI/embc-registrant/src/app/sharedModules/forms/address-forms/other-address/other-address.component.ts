import { Component, Input } from '@angular/core';
import { UntypedFormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-other-address',
  templateUrl: './other-address.component.html',
  styleUrls: ['./other-address.component.scss']
})
export class OtherAddressComponent {
  @Input() addressForm: UntypedFormGroup;

  constructor() {}

  get addressFormControl(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }
}
