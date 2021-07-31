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
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { StatusDefinitionDialogComponent } from 'src/app/shared/components/dialog-components/status-definition-dialog/status-definition-dialog.component';
import { VerifyEvacueeDialogComponent } from 'src/app/shared/components/dialog-components/verify-evacuee-dialog/verify-evacuee-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-evacuee-profile-dashboard',
  templateUrl: './evacuee-profile-dashboard.component.html',
  styleUrls: ['./evacuee-profile-dashboard.component.scss']
})
export class EvacueeProfileDashboardComponent implements OnInit {
  evacueeProfile: RegistrantProfileModel;
  evacueeProfileId: string;
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private cacheService: CacheService,
    private evacueeSessionService: EvacueeSessionService,
    private evacueeProfileService: EvacueeProfileService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.evacueeProfileId = this.evacueeSessionService.profileId;
    this.getEvacueeProfile(this.evacueeProfileId);
    if (this.evacueeSessionService.fileLinkStatus === 'S') {
      this.openLinkDialog(globalConst.essFileLinkMessage)
        .afterClosed()
        .subscribe((value) => {
          this.evacueeSessionService.fileLinkFlag = null;
          this.evacueeSessionService.fileLinkMetaData = null;
          this.evacueeSessionService.fileLinkStatus = null;
        });
    } else if (this.evacueeSessionService.fileLinkStatus === 'E') {
      this.openLinkDialog(globalConst.essFileLinkErrorMessage)
        .afterClosed()
        .subscribe((value) => {
          this.evacueeSessionService.fileLinkFlag = null;
          this.evacueeSessionService.fileLinkMetaData = null;
          this.evacueeSessionService.fileLinkStatus = null;
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
      .subscribe((value) => {
        if (value === 'verified') {
          this.verifyProfile();
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
      width: '530px'
    });
  }

  /**
   * Calls the API to verify the Registrant Profile
   */
  private verifyProfile(): void {
    this.evacueeProfileService
      .setVerifiedStatus(this.evacueeProfileId, true)
      .subscribe(
        (evacueeProfile) => {
          this.evacueeProfile = evacueeProfile;
          this.isLoading = !this.isLoading;
          this.openSuccessModal(globalConst.successfulVerification);
        },
        (error) => {
          this.isLoading = !this.isLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.verifyRegistrantProfileError
          );
        }
      );
  }

  /**
   * Sets local variables with the selected Profile to displayed them into the Profile Dashboard
   *
   * @param evacueeProfileId the evacuee Profile ID needed to get the profile details
   */
  private getEvacueeProfile(evacueeProfileId): void {
    this.evacueeProfileService.getProfileFromId(evacueeProfileId).subscribe(
      (profile: RegistrantProfileModel) => {
        this.evacueeProfile = profile;
      },
      (error) => {
        this.isLoading = !this.isLoading;
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          globalConst.verifyRegistrantProfileError
        );
      }
    );
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
