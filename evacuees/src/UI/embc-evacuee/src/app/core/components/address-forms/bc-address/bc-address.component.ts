import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-bc-address',
  templateUrl: './bc-address.component.html',
  styleUrls: ['./bc-address.component.scss']
})
export class BcAddressComponent implements OnInit {

  @Input() addressForm: FormGroup;

  constructor() { }

  ngOnInit(): void { 
   
  }

  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

}
