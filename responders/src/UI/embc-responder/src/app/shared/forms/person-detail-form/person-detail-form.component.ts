import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { CacheService } from 'src/app/core/services/cache.service';
import * as globalConst from 'src/app/core/services/global-constants';
import { IMaskDirective } from 'angular-imask';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';

@Component({
  selector: 'app-person-detail-form',
  templateUrl: './person-detail-form.component.html',
  styleUrls: ['./person-detail-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatCheckbox,
    MatSelect,
    MatOption,
    IMaskDirective,
    MatHint
  ]
})
export class PersonDetailFormComponent implements OnInit {
  @Input() personalDetailsForm: UntypedFormGroup;
  gender = globalConst.gender;
  primaryApplicantLastName: string;
  sameLastNameOption: any;
  readonly dateMask = globalConst.dateMask;
  readonly phoneMask = globalConst.phoneMask;
  readOnlyInput = false;

  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {
    // Work in progress. Temporary calling from the cache. Needs to be changed to call the Profile GET API
    const mainApplicantData = JSON.parse(this.cacheService.get('evacueeSearchContext'));
    this.primaryApplicantLastName = mainApplicantData?.evacueeSearchParameters?.lastName;
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
      this.personalDetailsForm.get('lastName').setValue(this.primaryApplicantLastName);
      this.readOnlyInput = true;
    } else {
      this.personalDetailsForm.get('lastName').setValue('');
      this.readOnlyInput = false;
    }
  }

  sameLastNameEditForm(): void {
    if (this.personalDetailsForm?.get('sameLastName').value) {
      this.readOnlyInput = true;
    } else {
      this.readOnlyInput = false;
    }
  }
}
