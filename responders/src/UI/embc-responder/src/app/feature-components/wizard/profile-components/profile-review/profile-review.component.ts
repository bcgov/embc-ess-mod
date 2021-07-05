import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from '../../wizard.service';

import * as globalConst from 'src/app/core/services/global-constants';
import { Community } from 'src/app/core/services/locations.service';
import { RegistrantProfile } from 'src/app/core/api/models';
import { WizardStepService } from '../../wizard-step.service';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';

@Component({
  selector: 'app-profile-review',
  templateUrl: './profile-review.component.html',
  styleUrls: ['./profile-review.component.scss']
})
export class ProfileReviewComponent implements OnInit, OnDestroy {
  verifiedProfileGroup: FormGroup = null;
  tabUpdateSubscription: Subscription;

  saveLoader = false;
  disableButton = false;

  primaryCommunity: string;
  mailingCommunity: string;

  constructor(
    private router: Router,
    private wizardService: WizardService,
    private wizardStepService: WizardStepService,
    private evacueeProfileService: EvacueeProfileService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public stepEvacueeProfileService: StepEvacueeProfileService
  ) {}

  ngOnInit(): void {
    // Set up form validation for verification check
    this.primaryCommunity =
      typeof this.stepEvacueeProfileService.primaryAddressDetails?.community ===
      'string'
        ? this.stepEvacueeProfileService.primaryAddressDetails?.community
        : (this.stepEvacueeProfileService.primaryAddressDetails
            ?.community as Community)?.name;
    this.mailingCommunity =
      typeof this.stepEvacueeProfileService.mailingAddressDetails?.community ===
      'string'
        ? this.stepEvacueeProfileService.mailingAddressDetails?.community
        : (this.stepEvacueeProfileService.mailingAddressDetails
            ?.community as Community)?.name;
    this.verifiedProfileGroup = this.formBuilder.group({
      verifiedProfile: [
        this.stepEvacueeProfileService.verifiedProfile,
        Validators.required
      ]
    });

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepEvacueeProfileService.nextTabUpdate?.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

  get verifiedProfileControl(): { [key: string]: AbstractControl } {
    return this.verifiedProfileGroup.controls;
  }

  /**
   * Go back to the Security Questions tab
   */
  back(): void {
    this.router.navigate(['/ess-wizard/evacuee-profile/security-questions']);
  }

  /**
   * Create or update evacuee profile and continue to Step 2
   */
  save(): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();
    if (this.verifiedProfileGroup.valid) {
      this.saveLoader = true;

      // TODO: If profile's already been created, update existing record
      //if (!this.evacueeSession.profileId) {
      this.evacueeProfileService
        .createProfile(this.stepEvacueeProfileService.createProfileDTO())
        .subscribe(
          (profile: RegistrantProfileModel) => {
            // After creating and fetching profile, update Profile Step values
            this.stepEvacueeProfileService.setFormValuesFromProfile(profile);

            // Once all profile work is done, tell user save is complete and go to Step 2
            this.disableButton = true;
            this.saveLoader = false;

            this.stepEvacueeProfileService
              .openModal(globalConst.evacueeProfileCreatedMessage)
              .afterClosed()
              .subscribe(() => {
                this.wizardService.setStepStatus('/ess-wizard/ess-file', false);
                this.wizardStepService.essFileStepFromProfileCreation(profile);

                this.router.navigate(['/ess-wizard/ess-file'], {
                  state: { step: 'STEP 2', title: 'Create ESS File' }
                });
              });
          },
          (error) => {
            this.saveLoader = false;
            this.alertService.setAlert(
              'danger',
              globalConst.createRegProfileError
            );
          }
        );
      //}
      //else {
      //TODO: Update Profile code to go here
      //}
    } else {
      this.verifiedProfileControl.verifiedProfile.markAsTouched();
    }
  }

  /**
   * Checks the form validity and updates the tab status
   */
  updateTabStatus() {
    if (this.verifiedProfileGroup.valid) {
      this.stepEvacueeProfileService.setTabStatus('review', 'complete');
    }

    this.stepEvacueeProfileService.verifiedProfile = this.verifiedProfileGroup.get(
      'verifiedProfile'
    ).value;
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
