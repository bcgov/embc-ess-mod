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
import { WizardAdapterService } from '../../wizard-adapter.service';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { SecurityQuestion } from 'src/app/core/api/models';

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

  displayQuestions: SecurityQuestion[];

  primaryCommunity: string;
  mailingCommunity: string;

  constructor(
    private router: Router,
    private wizardService: WizardService,
    private wizardAdapterService: WizardAdapterService,
    private evacueeProfileService: EvacueeProfileService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public stepEvacueeProfileService: StepEvacueeProfileService,
    public evacueeSessionService: EvacueeSessionService
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

    // Set up displayed version of Security Questions, depending on if they've been edited
    this.displayQuestions = this.stepEvacueeProfileService.editQuestions
      ? this.stepEvacueeProfileService.securityQuestions
      : this.stepEvacueeProfileService.savedQuestions;

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

      if (!this.evacueeSessionService.profileId) {
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
                .openModal(globalConst.newRegWizardProfileCreatedMessage)
                .afterClosed()
                .subscribe(() => {
                  this.wizardService.setStepStatus(
                    '/ess-wizard/ess-file',
                    false
                  );
                  this.wizardAdapterService.createEssFileFromProfileStep(
                    profile
                  );

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
      } else {
        // Update existing record
        this.evacueeProfileService
          .updateProfile(
            this.evacueeSessionService.profileId,
            this.stepEvacueeProfileService.createProfileDTO()
          )
          .subscribe(
            (profile: RegistrantProfileModel) => {
              // After creating and fetching profile, update Profile Step values
              this.stepEvacueeProfileService.setFormValuesFromProfile(profile);

              // Once all profile work is done, tell user save is complete and go to Step 2
              this.disableButton = true;
              this.saveLoader = false;

              switch (this.evacueeSessionService.getWizardType()) {
                case WizardType.NewRegistration:
                  this.stepEvacueeProfileService
                    .openModal(globalConst.newRegWizardProfileUpdatedMessage)
                    .afterClosed()
                    .subscribe(() => {
                      this.wizardService.setStepStatus(
                        '/ess-wizard/ess-file',
                        false
                      );
                      this.wizardAdapterService.createEssFileFromProfileStep(
                        profile
                      );

                      this.router.navigate(['/ess-wizard/ess-file'], {
                        state: { step: 'STEP 2', title: 'Create ESS File' }
                      });
                    });
                  return;

                case WizardType.EditRegistration:
                  this.router
                    .navigate([
                      'responder-access/search/evacuee-profile-dashboard'
                    ])
                    .then(() =>
                      this.stepEvacueeProfileService.openModal(
                        globalConst.evacueeProfileUpdatedMessage
                      )
                    );
                  return;
              }
            },
            (error) => {
              this.saveLoader = false;
              this.alertService.setAlert(
                'danger',
                globalConst.createRegProfileError
              );
            }
          );
      }
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
