import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-usa-address',
  templateUrl: './usa-address.component.html',
  styleUrls: ['./usa-address.component.scss']
})
export class UsaAddressComponent implements OnInit {

  @Input() addressForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

}
