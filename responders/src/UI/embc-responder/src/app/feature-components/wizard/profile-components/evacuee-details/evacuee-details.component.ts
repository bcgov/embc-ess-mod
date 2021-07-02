import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { Subscription } from 'rxjs';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';

@Component({
  selector: 'app-evacuee-details',
  templateUrl: './evacuee-details.component.html',
  styleUrls: ['./evacuee-details.component.scss']
})
export class EvacueeDetailsComponent implements OnInit, OnDestroy {
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
  tabUpdateSubscription: Subscription;

  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private evacueeSessionService: EvacueeSessionService
  ) {}

  ngOnInit(): void {
    this.createEvacueeDetailsForm();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepEvacueeProfileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

  createEvacueeDetailsForm(): void {
    this.evacueeDetailsForm = this.formBuilder.group({
      firstName: [
        {
          value: this.stepEvacueeProfileService.personalDetails.firstName,
          disabled: true
        }
      ],
      lastName: [
        {
          value: this.stepEvacueeProfileService.personalDetails.lastName,
          disabled: true
        }
      ],
      preferredName: [
        this.stepEvacueeProfileService.personalDetails !== undefined
          ? this.stepEvacueeProfileService.personalDetails.preferredName
          : ''
      ],
      initials: [
        this.stepEvacueeProfileService.personalDetails !== undefined
          ? this.stepEvacueeProfileService.personalDetails.initials
          : ''
      ],
      gender: [
        this.stepEvacueeProfileService.personalDetails !== undefined
          ? this.stepEvacueeProfileService.personalDetails.gender
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      dateOfBirth: [
        {
          value: this.stepEvacueeProfileService.personalDetails.dateOfBirth,
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
   * Navigate to next tab
   */
  next(): void {
    this.router.navigate(['/ess-wizard/evacuee-profile/address']);
  }

  /**
   * Navigates to the previous tab
   */
  back(): void {
    this.router.navigate(['/ess-wizard/evacuee-profile/restriction']);
  }

  /**
   * Checks the form validity and updates the tab status
   */
  updateTabStatus() {
    if (this.evacueeDetailsForm.valid) {
      this.stepEvacueeProfileService.setTabStatus(
        'evacuee-details',
        'complete'
      );
    } else {
      this.stepEvacueeProfileService.setTabStatus(
        'evacuee-details',
        'incomplete'
      );
    }
    this.stepEvacueeProfileService.personalDetails = this.evacueeDetailsForm.getRawValue();
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
