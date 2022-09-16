import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-other-address',
  templateUrl: './other-address.component.html',
  styleUrls: ['./other-address.component.scss']
})
export class OtherAddressComponent implements OnInit {
  @Input() addressForm: UntypedFormGroup;

  constructor() {}

  ngOnInit(): void {}

  get addressFormControl(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }
}
