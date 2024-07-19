import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import * as globalConst from '../../../core/services/globalConstants';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IMaskDirective } from 'angular-imask';

@Component({
  selector: 'app-person-detail-form',
  templateUrl: './person-detail-form.component.html',
  styleUrls: ['./person-detail-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    IMaskDirective
  ]
})
export class PersonDetailFormComponent implements OnInit {
  @Input() personalDetailsForm: UntypedFormGroup;
  gender = globalConst.gender;
  primaryApplicantLastName: string;
  sameLastNameOption: any;
  readonly dateMask = globalConst.DateMask;
  readOnlyInput = false;
  readonly phoneMask = { mask: '000-000-0000' };

  constructor(private formCreationService: FormCreationService) {}

  ngOnInit(): void {
    this.formCreationService.getPersonalDetailsForm().subscribe((personalDetails) => {
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
      this.personalDetailsForm.get('lastName').setValue(this.primaryApplicantLastName);
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
