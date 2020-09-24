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
    this.addressForm.get('address.stateProvince').setValue('British Columbia');
    this.addressForm.get('address.stateProvince').disable();

    this.addressForm.get('address.country').setValue('Canada');
    this.addressForm.get('address.country').disable();
  }

}
