import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../core/services/global-constants';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';
import { EvacueeProfileDashboardService } from './evacuee-profile-dashboard.service';

@Component({
  selector: 'app-evacuee-profile-dashboard',
  templateUrl: './evacuee-profile-dashboard.component.html',
  styleUrls: ['./evacuee-profile-dashboard.component.scss']
})
export class EvacueeProfileDashboardComponent implements OnInit {
  evacueeProfile: RegistrantProfileModel;
  evacueeProfileId: string;
  isLoading = false;
  emailLoader = false;
  emailSuccessMessage: string;
  isPaperBased: boolean;
  paperBasedEssFile: string;

  constructor(
    private router: Router,
    private evacueeSessionService: EvacueeSessionService,
    private evacueeProfileService: EvacueeProfileService,
    private evacueeSearchService: EvacueeSearchService,
    private alertService: AlertService,
    private evacueeProfileDashboardService: EvacueeProfileDashboardService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  ngOnInit(): void {
    this.evacueeProfileId =
      this.evacueeProfileDashboardService.fetchProfileId();

    this.isPaperBased = this.evacueeSessionService?.isPaperBased;
    this.paperBasedEssFile = this.evacueeSearchService.paperBasedEssFile;
    this.emailSuccessMessage = '';
    this.getEvacueeProfile(this.evacueeProfileId);
    this.evacueeProfileDashboardService.showFileLinkingPopups();
  }

  /**
   * Open the dialog with definition of
   * profile status
   */
  openStatusDefinition(): void {
    this.evacueeProfileDashboardService.openStatusDefinition();
  }

  /**
   * Verifies the evacuee
   */
  verifyEvacuee(): void {
    this.evacueeProfileDashboardService
      .openVerifyDialog(this.evacueeProfile)
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value === 'verified') {
            this.verifyProfile();
          }
        }
      });
  }

  /**
   * Navigates to the Wizard configured to insert a new ESS File
   */
  createNewESSFile(): void {
    this.isLoading = true;
    if (this.evacueeSessionService.isPaperBased) {
      this.evacueeProfileService
        .getProfileFiles(undefined, this.paperBasedEssFile)
        .subscribe({
          next: (result) => {
            if (result.length === 0) {
              this.navigateToWizard();
            } else {
              this.isLoading = false;
              this.evacueeProfileDashboardService.openEssFileExistsDialog(
                this.evacueeSearchService.paperBasedEssFile
              );
            }
          },
          error: (errorResponse) => {
            this.isLoading = false;
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.findEssFileError);
          }
        });
    } else {
      this.navigateToWizard();
    }
  }

  /**
   * Navigates to the Wizard configured to update the current registrant Profile
   */
  editProfile(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.EditRegistration,
      lastCompletedStep: null,
      editFlag:
        !this.appBaseService?.appModel?.selectedProfile
          ?.selectedEvacueeInContext?.authenticatedUser &&
        this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
          ?.verifiedUser, // true,
      memberFlag: false
    };
    this.computeState.triggerEvent();

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.EditRegistration },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Sends bc services card invite
   */
  sendEmail(): void {
    this.evacueeProfileDashboardService
      .openEmailInviteDialog(this.evacueeProfile?.contactDetails?.email)
      .afterClosed()
      .subscribe({
        next: (emailId) => {
          if (emailId !== 'close') {
            this.emailLoader = !this.emailLoader;
            this.evacueeProfileDashboardService
              .inviteByEmail(emailId, this.evacueeProfile.id)
              .subscribe({
                next: (value) => {
                  this.emailLoader = !this.emailLoader;
                  this.emailSuccessMessage =
                    'Email sent successfully to ' + emailId;
                },
                error: (error) => {
                  this.emailLoader = !this.emailLoader;
                  this.alertService.clearAlert();
                  this.alertService.setAlert(
                    'danger',
                    globalConst.bcscInviteError
                  );
                }
              });
          }
        }
      });
  }

  /**
   * Calls the API to verify the Registrant Profile
   */
  private verifyProfile(): void {
    this.isLoading = !this.isLoading;
    this.evacueeProfileService
      .setVerifiedStatus(this.evacueeProfileId, true)
      .subscribe({
        next: (evacueeProfile) => {
          this.evacueeProfile = evacueeProfile;
          this.isLoading = !this.isLoading;
          this.evacueeProfileDashboardService.openSuccessModal(
            globalConst.successfulVerification
          );
        },
        error: (error) => {
          this.isLoading = !this.isLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.verifyRegistrantProfileError
          );
        }
      });
  }

  /**
   * Sets local variables with the selected Profile to displayed them into the Profile Dashboard
   *
   * @param evacueeProfileId the evacuee Profile ID needed to get the profile details
   */
  private getEvacueeProfile(evacueeProfileId): void {
    this.evacueeProfileService.getProfileFromId(evacueeProfileId).subscribe({
      next: (profile: RegistrantProfileModel) => {
        this.evacueeProfile = profile;
        if (
          !this.isPaperBased &&
          !this.evacueeProfile?.securityQuestions?.length
        ) {
          this.evacueeProfileDashboardService.openIncompleteProfileDialog(
            globalConst.incompleteProfileMessage
          );
        }
      },
      error: (error) => {
        this.isLoading = !this.isLoading;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.getProfileError);
      }
    });
  }

  /**
   * navigates to the wizard component
   */
  private navigateToWizard(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.NewEssFile,
      lastCompletedStep: null,
      editFlag: false,
      memberFlag: false
    };
    this.appBaseService.appModel = { selectedEssFile: null };
    this.computeState.triggerEvent();

    this.router
      .navigate(['/ess-wizard'], {
        queryParams: { type: WizardType.NewEssFile },
        queryParamsHandling: 'merge'
      })
      .then(() => {
        this.isLoading = false;
      })
      .catch(() => {
        this.isLoading = false;
      });
  }
}
