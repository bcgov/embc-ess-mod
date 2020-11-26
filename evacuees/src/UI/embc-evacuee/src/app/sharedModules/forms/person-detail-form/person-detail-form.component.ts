import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import * as globalConst from '../../../core/services/globalConstants';

@Component({
  selector: 'app-person-detail-form',
  templateUrl: './person-detail-form.component.html',
  styleUrls: ['./person-detail-form.component.scss']
})
export class PersonDetailFormComponent implements OnInit {

  @Input() personalDetailsForm: FormGroup;
  gender = globalConst.gender;

  constructor() { }

  ngOnInit(): void {
    
  }

 /**
  * Returns the control of the form
  */
  get personalFormControl(): { [key: string]: AbstractControl; } {
    return this.personalDetailsForm.controls;
  }

}
