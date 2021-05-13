import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { EvacueeSearchService } from 'src/app/feature-components/search/evacuee-search/evacuee-search.service';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';

@Component({
  selector: 'app-evacuee-details',
  templateUrl: './evacuee-details.component.html',
  styleUrls: ['./evacuee-details.component.scss']
})
export class EvacueeDetailsComponent implements OnInit {
  evacueeDetailsForm: FormGroup;
  gender = globalConst.gender;
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
  evacueeSearchContext: EvacueeSearchContextModel;

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private evacueeSearchService: EvacueeSearchService
  ) {}

  ngOnInit(): void {
    this.createEvacueeDetailsForm();
    this.evacueeSearchContext = this.evacueeSearchService.getEvacueeSearchContext();
  }

  createEvacueeDetailsForm(): void {
    this.evacueeDetailsForm = this.formBuilder.group({
      firstName: [
        {
          value: this.evacueeSearchService.getEvacueeSearchContext()
            .evacueeSearchParameters.firstName,
          disabled: true
        }
      ],
      lastName: [
        {
          value: this.evacueeSearchService.getEvacueeSearchContext()
            .evacueeSearchParameters.lastName,
          disabled: true
        }
      ],
      preferredName: [
        this.stepCreateProfileService.personalDetails !== undefined
          ? this.stepCreateProfileService.personalDetails.preferredName
          : ''
      ],
      initials: [
        this.stepCreateProfileService.personalDetails !== undefined
          ? this.stepCreateProfileService.personalDetails.initials
          : ''
      ],
      gender: [
        this.stepCreateProfileService.personalDetails !== undefined
          ? this.stepCreateProfileService.personalDetails.gender
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      dateOfBirth: [
        {
          value: this.evacueeSearchService.getEvacueeSearchContext()
            .evacueeSearchParameters.dateOfBirth,
          disabled: true
        }
      ]
    });
  }

  /**
   * Returns the control of the form
   */
  get detailsFormControl(): { [key: string]: AbstractControl } {
    return this.evacueeDetailsForm.controls;
  }

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    this.updateTabStatus();
    this.router.navigate(['/ess-wizard/create-evacuee-profile/address']);
  }

  back(): void {
    this.updateTabStatus();
    this.router.navigate(['/ess-wizard/create-evacuee-profile/restriction']);
  }

  updateTabStatus() {
    if (this.evacueeDetailsForm.valid) {
      this.stepCreateProfileService.setTabStatus('evacuee-details', 'complete');
    } else {
      this.stepCreateProfileService.setTabStatus(
        'evacuee-details',
        'incomplete'
      );
    }
    this.stepCreateProfileService.personalDetails = this.evacueeDetailsForm.getRawValue();
  }
}
