import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { TextMaskModule } from 'angular2-text-mask';
import * as globalConst from '../../../../core/services/globalConstants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export default class PersonalDetailsComponent implements OnInit, OnDestroy {
  personalDetailsForm: UntypedFormGroup;
  gender = globalConst.gender;
  formBuilder: UntypedFormBuilder;
  personalDetailsForm$: Subscription;
  formCreationService: FormCreationService;
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
  editVerifiedPersonalDetails = '/verified-registration/edit/personal-details';
  createVerifiedProfile = '/verified-registration/create-profile';
  disableFields = false;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.personalDetailsForm$ = this.formCreationService
      .getPersonalDetailsForm()
      .subscribe((personalDetails) => {
        this.personalDetailsForm = personalDetails;
      });

    if (
      window.location.pathname === this.editVerifiedPersonalDetails ||
      window.location.pathname === this.createVerifiedProfile
    ) {
      this.disableFields = true;
    }
  }

  /**
   * Returns the control of the form
   */
  get personalFormControl(): { [key: string]: AbstractControl } {
    return this.personalDetailsForm.controls;
  }

  ngOnDestroy(): void {
    this.personalDetailsForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    DirectivesModule,
    TextMaskModule
  ],
  declarations: [PersonalDetailsComponent]
})
class PersonalDetailsModule {}
