import { Component, OnInit } from '@angular/core';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
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
  readonly selectedPathType = SelectedPathType;

  constructor(
    private evacueeProfileService: EvacueeProfileService,
    private evacueeSearchService: EvacueeSearchService,
    private alertService: AlertService,
    private evacueeProfileDashboardService: EvacueeProfileDashboardService,
    public optionInjectionService: OptionInjectionService
  ) {}

  ngOnInit(): void {
    this.evacueeProfileId =
      this.evacueeProfileDashboardService.fetchProfileId();
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
    this.optionInjectionService.instance
      ?.openWizard(WizardType.NewEssFile)
      ?.then((value) => {
        if (!value) {
          this.isLoading = false;
          this.evacueeProfileDashboardService.openEssFileExistsDialog(
            this.evacueeSearchService?.evacueeSearchContext
              ?.evacueeSearchParameters?.paperFileNumber
          );
        }
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  /**
   * Navigates to the Wizard configured to update the current registrant Profile
   */
  editProfile(): void {
    this.isLoading = true;
    this.optionInjectionService.instance
      ?.openWizard(WizardType.EditRegistration)
      ?.then((value) => {
        this.isLoading = false;
      })
      .catch(() => {
        this.isLoading = false;
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
    this.optionInjectionService?.instance
      ?.loadEvcaueeProfile(evacueeProfileId)
      ?.then((profile: RegistrantProfileModel) => {
        this.evacueeProfile = profile;
        if (
          this.optionInjectionService.instance.optionType !==
            SelectedPathType.paperBased &&
          !this.evacueeProfile?.securityQuestions?.length
        ) {
          this.evacueeProfileDashboardService.openIncompleteProfileDialog(
            globalConst.incompleteProfileMessage
          );
        }
      })
      .catch((error) => {
        this.isLoading = !this.isLoading;
      });
  }
}
