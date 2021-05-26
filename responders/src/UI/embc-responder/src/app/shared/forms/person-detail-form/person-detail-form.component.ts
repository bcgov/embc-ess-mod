import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CacheService } from 'src/app/core/services/cache.service';
import * as globalConst from 'src/app/core/services/global-constants';

@Component({
  selector: 'app-person-detail-form',
  templateUrl: './person-detail-form.component.html',
  styleUrls: ['./person-detail-form.component.scss']
})
export class PersonDetailFormComponent implements OnInit {
  @Input() personalDetailsForm: FormGroup;
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

  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {
    const mainApplicantData = JSON.parse(
      this.cacheService.get('evacueeSearchContext')
    );
    this.primaryApplicantLastName =
      mainApplicantData?.evacueeSearchParameters.lastName;
    this.sameLastNameEditForm();
  }

  /**
   * Returns the control of the form
   */
  get personalFormControl(): { [key: string]: AbstractControl } {
    return this.personalDetailsForm?.controls;
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
    if (this.personalDetailsForm?.get('sameLastNameCheck').value) {
      this.readOnlyInput = true;
    } else {
      this.readOnlyInput = false;
    }
  }
}
