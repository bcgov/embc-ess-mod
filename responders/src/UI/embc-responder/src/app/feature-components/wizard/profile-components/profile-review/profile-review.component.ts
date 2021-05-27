import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';
import { WizardService } from '../../wizard.service';

import * as globalConst from 'src/app/core/services/global-constants';

@Component({
  selector: 'app-profile-review',
  templateUrl: './profile-review.component.html',
  styleUrls: ['./profile-review.component.scss']
})
export class ProfileReviewComponent implements OnInit, OnDestroy {
  verifiedProfileFC: FormControl = null;
  tabUpdateSubscription: Subscription;
  saveLoader = false;

  constructor(
    private router: Router,
    private wizardService: WizardService,
    private evacueeProfileService: EvacueeProfileService,
    private alertService: AlertService,
    public stepCreateProfileService: StepCreateProfileService
  ) {}

  ngOnInit(): void {
    // Set up form validation for verification check
    this.verifiedProfileFC = new FormControl(
      this.stepCreateProfileService.verifiedProfile,
      Validators.required
    );

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateProfileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

  /**
   * Go back to the Security Questions tab
   */
  back(): void {
    this.router.navigate([
      '/ess-wizard/create-evacuee-profile/security-questions'
    ]);
  }

  /**
   * Submit evacuee profile and continue to Step 2
   */
  save(): void {
    this.stepCreateProfileService.nextTabUpdate.next();

    if (this.verifiedProfileFC.valid) {
      this.saveLoader = true;

      this.evacueeProfileService
        .upsertProfile(this.stepCreateProfileService.createProfileDTO())
        .subscribe(
          (profileId) => {
            this.stepCreateProfileService.openModal(
              globalConst.evacueeProfileCreatedMessage.text,
              globalConst.evacueeProfileCreatedMessage.title
            );

            this.wizardService.setStepStatus(
              '/ess-wizard/create-ess-file',
              false
            );
          },
          (error) => {
            this.saveLoader = false;

            this.alertService.setAlert(
              'danger',
              error?.title || globalConst.createProfileError
            );
          }
        );
    } else {
      this.verifiedProfileFC.markAsTouched();
    }

    // this.router.navigate(['/ess-wizard/create-ess-file'], {
    //   state: { step: 'STEP 2', title: 'Create ESS File' }
    // });
  }

  /**
   * Checks the form validity and updates the tab status
   */
  updateTabStatus() {
    if (this.verifiedProfileFC.valid) {
      this.stepCreateProfileService.setTabStatus('review', 'complete');
    }

    this.stepCreateProfileService.verifiedProfile = this.verifiedProfileFC.value;
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepCreateProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
