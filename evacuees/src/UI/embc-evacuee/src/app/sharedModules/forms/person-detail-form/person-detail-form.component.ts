import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-person-detail-form',
  templateUrl: './person-detail-form.component.html',
  styleUrls: ['./person-detail-form.component.scss']
})
export class PersonDetailFormComponent implements OnInit {

  @Input() personalDetailsForm: FormGroup;
  gender: Array<string> = new Array<string>();

  constructor() { }

  ngOnInit(): void {
    this.gender = ['Male', 'Female', 'X'];
  }

 /**
  * Returns the control of the form
  */
  get personalFormControl(): { [key: string]: AbstractControl; } {
    return this.personalDetailsForm.controls;
  }

}
