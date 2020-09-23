import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

}
