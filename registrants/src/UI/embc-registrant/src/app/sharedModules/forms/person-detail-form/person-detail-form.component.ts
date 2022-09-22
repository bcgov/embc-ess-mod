import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import * as globalConst from '../../../core/services/globalConstants';

@Component({
  selector: 'app-person-detail-form',
  templateUrl: './person-detail-form.component.html',
  styleUrls: ['./person-detail-form.component.scss']
})
export class PersonDetailFormComponent implements OnInit {
  @Input() personalDetailsForm: UntypedFormGroup;
  gender = globalConst.gender;
  primaryApplicantLastName: string;
  sameLastNameOption: any;
  readonly dateMask = [
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  readOnlyInput = false;

  constructor(private formCreationService: FormCreationService) {}

  ngOnInit(): void {
    this.formCreationService
      .getPersonalDetailsForm()
      .subscribe((personalDetails) => {
        this.primaryApplicantLastName = personalDetails.get('lastName').value;
      });
    this.sameLastNameEditForm();
  }

  /**
   * Returns the control of the form
   */
  get personalFormControl(): { [key: string]: AbstractControl } {
    return this.personalDetailsForm.controls;
  }

  sameLastNameEvent(event: MatCheckboxChange): void {
    if (event.checked) {
      this.personalDetailsForm
        .get('lastName')
        .setValue(this.primaryApplicantLastName);
      this.readOnlyInput = true;
    } else {
      this.personalDetailsForm.get('lastName').setValue('');
      this.readOnlyInput = false;
    }
  }

  sameLastNameEditForm(): void {
    if (this.personalDetailsForm.get('sameLastNameCheck').value) {
      this.readOnlyInput = true;
    } else {
      this.readOnlyInput = false;
    }
  }
}
