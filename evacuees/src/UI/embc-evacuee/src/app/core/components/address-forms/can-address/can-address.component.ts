import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-can-address',
  templateUrl: './can-address.component.html',
  styleUrls: ['./can-address.component.scss']
})
export class CanAddressComponent implements OnInit {

  @Input() addressForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

}
