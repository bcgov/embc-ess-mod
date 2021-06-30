import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { EvacueeSearchService } from 'src/app/feature-components/search/evacuee-search/evacuee-search.service';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { Subscription } from 'rxjs';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { VerifyEvacueeDialogComponent } from 'src/app/shared/components/dialog-components/verify-evacuee-dialog/verify-evacuee-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  evacueeSearchContext: EvacueeSearchContextModel;
  tabUpdateSubscription: Subscription;
  editFlag: boolean;
  verifiedProfile: boolean;
  showLockIcon = true;
  showUnlockLink = false;

  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private evacueeSearchService: EvacueeSearchService,
    private evacueeSessionService: EvacueeSessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.editFlag = this.evacueeSessionService.getEditWizardFlag();
    this.verifiedProfile = this.stepEvacueeProfileService.verifiedProfile;
    this.evacueeSearchContext = this.evacueeSearchService.evacueeSearchContext;

    this.createEvacueeDetailsForm();
    this.initDisabledFields();

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
        this.stepEvacueeProfileService.personalDetails !== undefined
          ? this.stepEvacueeProfileService.personalDetails.firstName
          : this.evacueeSearchService.evacueeSearchContext
              .evacueeSearchParameters.firstName,
        [this.customValidation.whitespaceValidator()]
      ],
      lastName: [
        this.stepEvacueeProfileService.personalDetails !== undefined
          ? this.stepEvacueeProfileService.personalDetails.lastName
          : this.evacueeSearchService.evacueeSearchContext
              .evacueeSearchParameters.lastName,
        [this.customValidation.whitespaceValidator()]
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
        this.stepEvacueeProfileService.personalDetails !== undefined
          ? this.stepEvacueeProfileService.personalDetails.dateOfBirth
          : this.evacueeSearchService.evacueeSearchContext
              .evacueeSearchParameters.dateOfBirth,
        [Validators.required, this.customValidation.dateOfBirthValidator()]
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
   * Enables the locked fields
   */
  editLockedFields(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: VerifyEvacueeDialogComponent,
          content: globalConst.unlockFieldsProfile
        },
        height: '410px',
        width: '620px'
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'verified') {
          this.evacueeDetailsForm.get('firstName').enable();
          this.evacueeDetailsForm.get('lastName').enable();
          this.evacueeDetailsForm.get('dateOfBirth').enable();
          this.showLockIcon = false;
          this.stepEvacueeProfileService.unlockedFields = true;
          this.showUnlockLink = false;
        }
      });
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

  /**
   * Function that determines whether firstName, lastName and DoB fields should be disabled or not
   */
  private initDisabledFields(): void {
    // If component is opened as a new profile or edit and verified profile
    if (
      (this.editFlag && !this.verifiedProfile) ||
      (this.editFlag && this.stepEvacueeProfileService.unlockedFields)
    ) {
      // If the profile is been edited and the evacuee is unverified
      this.evacueeDetailsForm.get('firstName').enable();
      this.evacueeDetailsForm.get('lastName').enable();
      this.evacueeDetailsForm.get('dateOfBirth').enable();
      this.showLockIcon = false;
    } else if (
      (!this.editFlag && this.verifiedProfile === undefined) ||
      (this.editFlag && this.verifiedProfile)
    ) {
      this.evacueeDetailsForm.get('firstName').disable();
      this.evacueeDetailsForm.get('lastName').disable();
      this.evacueeDetailsForm.get('dateOfBirth').disable();
      this.showLockIcon = true;

      if (this.editFlag && this.verifiedProfile) {
        this.showUnlockLink = true;
      }
    }
  }
}
