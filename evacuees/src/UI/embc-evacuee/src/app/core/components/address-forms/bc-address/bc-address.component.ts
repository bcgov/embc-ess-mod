import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bc-address',
  templateUrl: './bc-address.component.html',
  styleUrls: ['./bc-address.component.scss']
})
export class BcAddressComponent implements OnInit {

  @Input() addressForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.addressForm.get('stateProvince').setValue('British Columbia');
    this.addressForm.get('stateProvince').disable();

    this.addressForm.get('country').setValue('Canada');
    this.addressForm.get('country').disable();
  }

}
