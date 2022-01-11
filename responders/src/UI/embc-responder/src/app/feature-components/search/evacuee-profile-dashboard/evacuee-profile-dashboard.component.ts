import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { BcscInviteDialogComponent } from 'src/app/shared/components/dialog-components/bcsc-invite-dialog/bcsc-invite-dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { StatusDefinitionDialogComponent } from 'src/app/shared/components/dialog-components/status-definition-dialog/status-definition-dialog.component';
import { VerifyEvacueeDialogComponent } from 'src/app/shared/components/dialog-components/verify-evacuee-dialog/verify-evacuee-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../core/services/global-constants';
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

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private cacheService: CacheService,
    private evacueeSessionService: EvacueeSessionService,
    private evacueeProfileService: EvacueeProfileService,
    private alertService: AlertService,
    private evacueeProfileDashboardService: EvacueeProfileDashboardService
  ) {}

  ngOnInit(): void {
    this.evacueeProfileId = this.evacueeSessionService.profileId;
    this.emailSuccessMessage = '';
    this.getEvacueeProfile(this.evacueeProfileId);
    if (this.evacueeSessionService.fileLinkStatus === 'S') {
      this.openLinkDialog(globalConst.essFileLinkMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.evacueeSessionService.fileLinkFlag = null;
            this.evacueeSessionService.fileLinkMetaData = null;
            this.evacueeSessionService.fileLinkStatus = null;
          }
        });
    } else if (this.evacueeSessionService.fileLinkStatus === 'E') {
      this.openLinkDialog(globalConst.essFileLinkErrorMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.evacueeSessionService.fileLinkFlag = null;
            this.evacueeSessionService.fileLinkMetaData = null;
            this.evacueeSessionService.fileLinkStatus = null;
          }
        });
    }
  }

  /**
   * Open the dialog with definition of
   * profile status
   */
  openStatusDefinition(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: StatusDefinitionDialogComponent
      },
      height: '530px',
      width: '580px'
    });
  }

  /**
   * Verifies the evacuee
   */
  verifyEvacuee(): void {
    this.isLoading = !this.isLoading;
    this.dialog
      .open(DialogComponent, {
        data: {
          component: VerifyEvacueeDialogComponent,
          content: globalConst.verifyEvacueeProfile,
          profileData: this.evacueeProfile
        },
        height: '550px',
        width: '620px'
      })
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
    this.cacheService.set(
      'wizardOpenedFrom',
      '/responder-access/search/evacuee-profile-dashboard'
    );
    this.evacueeSessionService.essFileNumber = null;
    this.evacueeSessionService.setWizardType(WizardType.NewEssFile);
    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.NewEssFile },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Navigates to the Wizard configured to update the current registrant Profile
   */
  editProfile(): void {
    this.cacheService.set(
      'wizardOpenedFrom',
      '/responder-access/search/evacuee-profile-dashboard'
    );
    this.evacueeSessionService.setWizardType(WizardType.EditRegistration);

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.EditRegistration },
      queryParamsHandling: 'merge'
    });
  }

  sendEmail(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: BcscInviteDialogComponent,
          profileData: this.evacueeProfile?.contactDetails?.email
        },
        height: '520px',
        width: '600px'
      })
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
   * Open the dialog to indicate evacuee has been successfully
   * verified
   *
   * @param text Text to be displayed
   */
  private openSuccessModal(content: DialogContent): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      height: '230px',
      width: '630px'
    });
  }

  /**
   * Calls the API to verify the Registrant Profile
   */
  private verifyProfile(): void {
    this.evacueeProfileService
      .setVerifiedStatus(this.evacueeProfileId, true)
      .subscribe({
        next: (evacueeProfile) => {
          this.evacueeProfile = evacueeProfile;
          this.isLoading = !this.isLoading;
          this.openSuccessModal(globalConst.successfulVerification);
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
   * Opens link success dialog box
   *
   * @returns mat dialog reference
   */
  private openLinkDialog(displayMessage: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: displayMessage
      },
      width: '530px'
    });
  }
}
