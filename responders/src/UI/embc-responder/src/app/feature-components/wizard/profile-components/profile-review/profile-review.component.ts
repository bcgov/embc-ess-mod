import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
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
import { TabModel } from 'src/app/core/models/tab.model';
import { CustomErrorMailMatcher } from '../contact/contact.component';
import { CustomValidationService } from '../../../../core/services/customValidation.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Component({
  selector: 'app-profile-review',
  templateUrl: './profile-review.component.html',
  styleUrls: ['./profile-review.component.scss']
})
export class ProfileReviewComponent implements OnInit, OnDestroy {
  verifiedProfileGroup: UntypedFormGroup = null;
  tabUpdateSubscription: Subscription;

  saveLoader = false;
  disableButton = false;

  displayQuestions: SecurityQuestion[];

  primaryCommunity: string;
  mailingCommunity: string;
  tabMetaData: TabModel;
  inviteEmailGroup: UntypedFormGroup = null;
  emailMatcher = new CustomErrorMailMatcher();
  wizardType = WizardType;

  constructor(
    private router: Router,
    private wizardService: WizardService,
    private wizardAdapterService: WizardAdapterService,
    private evacueeProfileService: EvacueeProfileService,
    private customValidationService: CustomValidationService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public stepEvacueeProfileService: StepEvacueeProfileService,
    public evacueeSessionService: EvacueeSessionService,
    public appBaseService: AppBaseService
  ) {}

  ngOnInit(): void {
    // Set up form validation for verification check
    this.primaryCommunity =
      typeof this.stepEvacueeProfileService.primaryAddressDetails?.community ===
      'string'
        ? this.stepEvacueeProfileService.primaryAddressDetails?.community
        : (
            this.stepEvacueeProfileService.primaryAddressDetails
              ?.community as Community
          )?.name;
    this.mailingCommunity =
      typeof this.stepEvacueeProfileService.mailingAddressDetails?.community ===
      'string'
        ? this.stepEvacueeProfileService.mailingAddressDetails?.community
        : (
            this.stepEvacueeProfileService.mailingAddressDetails
              ?.community as Community
          )?.name;
    this.verifiedProfileGroup = this.formBuilder.group({
      verifiedProfile: [
        this.stepEvacueeProfileService.verifiedProfile,
        Validators.required
      ]
    });

    // Set up displayed version of Security Questions, depending on if they've been edited
    this.displayQuestions =
      this.stepEvacueeProfileService.editQuestions ||
      !(this.stepEvacueeProfileService.savedQuestions?.length > 0)
        ? this.stepEvacueeProfileService.securityQuestions
        : this.stepEvacueeProfileService.savedQuestions;

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEvacueeProfileService.nextTabUpdate?.subscribe(() => {
        this.updateTabStatus();
      });
    this.tabMetaData = this.stepEvacueeProfileService.getNavLinks('review');

    this.inviteEmailGroup = this.formBuilder.group(
      {
        email: [this.stepEvacueeProfileService.inviteEmail, Validators.email],
        confirmEmail: [
          this.stepEvacueeProfileService.confirmInviteEmail,
          Validators.email
        ]
      },
      {
        validators: [
          this.customValidationService.confirmEmailIsOptionalValidator()
        ]
      }
    );
  }

  get verifiedProfileControl(): { [key: string]: AbstractControl } {
    return this.verifiedProfileGroup.controls;
  }

  get inviteEmailControl(): { [key: string]: AbstractControl } {
    return this.inviteEmailGroup.controls;
  }

  /**
   * Go back to the Security Questions tab
   */
  back(): void {
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * Create or update evacuee profile and continue to Step 2
   */
  save(): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();
    if (this.verifiedProfileGroup.valid && this.inviteEmailGroup.valid) {
      this.saveLoader = true;

      if (
        !this.appBaseService?.appModel?.selectedProfile
          ?.selectedEvacueeInContext?.id &&
        this.appBaseService?.wizardProperties?.wizardType ===
          WizardType.NewRegistration
      ) {
        this.createNewProfile();
      } else if (
        this.appBaseService?.wizardProperties?.wizardType ===
        WizardType.MemberRegistration
      ) {
        this.createMemberRegistration();
      } else {
        this.editProfile();
      }
    } else {
      this.verifiedProfileControl.verifiedProfile.markAsTouched();
      this.inviteEmailControl.email.markAsTouched();
      this.inviteEmailControl.confirmEmail.markAsTouched();
    }
  }

  createNewProfile() {
    this.evacueeProfileService
      .createProfile(this.stepEvacueeProfileService.createProfileDTO())
      .subscribe({
        next: async (profile: RegistrantProfileModel) => {
          if (this.inviteEmailControl.email.value) {
            await this.sendEmailInvite(
              this.inviteEmailControl.email.value,
              profile.id
            );
          }
          this.disableButton = true;
          this.saveLoader = false;
          this.createNewProfileDialog(profile);
        },
        error: (error) => {
          this.saveLoader = false;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.createRegProfileError
          );
        }
      });
  }

  sendEmailInvite(email: string, profileId: string) {
    return new Promise<void>((resolve, reject) => {
      this.evacueeProfileService
        .inviteProfileByEmail(email, profileId)
        .subscribe({
          next: () => {
            resolve();
          },
          error: (error) => {
            this.saveLoader = false;
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.bcscInviteError);
            reject();
          }
        });
    });
  }

  createMemberRegistration() {
    this.evacueeProfileService
      .createMemberRegistration(
        this.stepEvacueeProfileService.createProfileDTO(),
        this.evacueeSessionService.memberRegistration.id,
        this.appBaseService?.appModel?.selectedEssFile?.id
      )
      .subscribe({
        next: async (profileId) => {
          if (this.inviteEmailControl.email.value) {
            await this.sendEmailInvite(
              this.inviteEmailControl.email.value,
              this.evacueeSessionService.newHouseholdRegistrantId
            );
          }
          this.disableButton = true;
          this.saveLoader = false;
          this.memberProfileDialog();
        },
        error: (error) => {
          this.saveLoader = false;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.createRegProfileError
          );
        }
      });
  }

  createNewProfileDialog(profile: RegistrantProfileModel) {
    this.stepEvacueeProfileService
      .openModal(globalConst.newRegWizardProfileCreatedMessage)
      .afterClosed()
      .subscribe({
        next: () => {
          this.wizardService.setStepStatus('/ess-wizard/ess-file', false);
          this.wizardAdapterService.stepCreateEssFileFromProfileRecord(profile);

          this.router.navigate(['/ess-wizard/ess-file'], {
            state: { step: 'STEP 2', title: 'Create ESS File' }
          });

          this.stepEvacueeProfileService.setFormValuesFromProfile(profile);
        }
      });
  }

  editProfile() {
    this.evacueeProfileService
      .updateProfile(
        this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
          ?.id,
        this.stepEvacueeProfileService.createProfileDTO()
      )
      .subscribe({
        next: (profile: RegistrantProfileModel) => {
          this.stepEvacueeProfileService.setFormValuesFromProfile(profile);
          this.disableButton = true;
          this.saveLoader = false;

          switch (this.appBaseService?.wizardProperties?.wizardType) {
            case WizardType.NewRegistration:
              this.editNewRegistrationProfileDialog(profile);
              return;

            case WizardType.EditRegistration:
              this.editProfileDialog();
              return;
          }
        },
        error: (error) => {
          this.saveLoader = false;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.createRegProfileError
          );
        }
      });
  }

  editNewRegistrationProfileDialog(profile: RegistrantProfileModel) {
    this.stepEvacueeProfileService
      .openModal(globalConst.newRegWizardProfileUpdatedMessage)
      .afterClosed()
      .subscribe({
        next: () => {
          this.wizardService.setStepStatus('/ess-wizard/ess-file', false);
          this.wizardAdapterService.stepCreateEssFileFromEditProfileRecord(
            profile
          );

          this.router.navigate(['/ess-wizard/ess-file'], {
            state: { step: 'STEP 2', title: 'Create ESS File' }
          });
        }
      });
  }

  memberProfileDialog() {
    this.router
      .navigate(['responder-access/search/essfile-dashboard'])
      .then(() =>
        this.stepEvacueeProfileService.openModal(
          globalConst.memberProfileCreateMessage
        )
      );
  }

  editProfileDialog() {
    this.router
      .navigate(['responder-access/search/evacuee-profile-dashboard'])
      .then(() =>
        this.stepEvacueeProfileService.openModal(
          globalConst.evacueeProfileUpdatedMessage
        )
      );
  }

  /**
   * Checks the form validity and updates the tab status
   */
  updateTabStatus() {
    if (this.verifiedProfileGroup.valid) {
      this.stepEvacueeProfileService.setTabStatus('review', 'complete');
    }

    this.stepEvacueeProfileService.verifiedProfile =
      this.verifiedProfileGroup.get('verifiedProfile').value;

    this.stepEvacueeProfileService.inviteEmail =
      this.inviteEmailGroup.get('email').value;

    this.stepEvacueeProfileService.confirmInviteEmail =
      this.inviteEmailGroup.get('confirmEmail').value;
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
