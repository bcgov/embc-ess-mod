import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RegistrationsService } from 'src/app/core/api/services';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { BcscInviteDialogComponent } from 'src/app/shared/components/dialog-components/bcsc-invite-dialog/bcsc-invite-dialog.component';
import { EssFileExistsComponent } from 'src/app/shared/components/dialog-components/ess-file-exists/ess-file-exists.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { StatusDefinitionDialogComponent } from 'src/app/shared/components/dialog-components/status-definition-dialog/status-definition-dialog.component';
import { VerifyEvacueeDialogComponent } from 'src/app/shared/components/dialog-components/verify-evacuee-dialog/verify-evacuee-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../core/services/global-constants';

@Injectable({ providedIn: 'root' })
export class EvacueeProfileDashboardService {
  constructor(
    private registrationService: RegistrationsService,
    private evacueeSessionService: EvacueeSessionService,
    private appBaseService: AppBaseService,
    protected dialog: MatDialog
  ) {}

  /**
   * Sends email invitation
   *
   * @param address emailAddress
   * @param registrantId registrant Id
   * @returns void observable
   */
  inviteByEmail(address: string, registrantId: string): Observable<void> {
    return this.registrationService.registrationsInviteToRegistrantPortal({
      registrantId,
      body: { email: address }
    });
  }

  /**
   * Resets file linking flags
   */
  resetLinkingFlags() {
    this.evacueeSessionService.fileLinkFlag = null;
    this.evacueeSessionService.fileLinkMetaData = null;
    this.evacueeSessionService.fileLinkStatus = null;
  }

  /**
   * Calculates profile to load
   *
   * @returns profileId
   */
  fetchProfileId(): string {
    if (
      this.appBaseService?.appModel?.selectedProfile
        ?.householdMemberRegistrantId !== undefined
    ) {
      return this.appBaseService?.appModel?.selectedProfile
        ?.householdMemberRegistrantId;
    } else {
      return this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext?.id;
    }
  }

  /**
   * Displays file linking dialog boxes
   */
  showFileLinkingPopups() {
    if (this.evacueeSessionService.fileLinkStatus === 'S') {
      this.openLinkDialog(globalConst.essFileLinkMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.resetLinkingFlags();
          }
        });
    } else if (this.evacueeSessionService.fileLinkStatus === 'E') {
      this.openLinkDialog(globalConst.essFileLinkErrorMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.resetLinkingFlags();
          }
        });
    }
  }

  /**
   * opens a dialog that notices the user that the paper based ESS File number already exists
   *
   * @param essFile the paper based essFile number to display on the dialog
   */
  public openEssFileExistsDialog(essFile: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: EssFileExistsComponent,
        content: { title: 'Paper ESS File Already Exists' },
        essFile
      },
      width: '493px'
    });
  }

  /**
   * Opens link success dialog box
   *
   * @returns mat dialog reference
   */
  public openLinkDialog(displayMessage: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: displayMessage
      },
      width: '530px'
    });
  }

  /**
   * Opens incomplete profile dialog
   */
  public openIncompleteProfileDialog(content: DialogContent): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      width: '630px'
    });
  }

  /**
   * Open the dialog to indicate evacuee has been successfully
   * verified
   *
   * @param text Text to be displayed
   */
  public openSuccessModal(content: DialogContent): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      width: '630px'
    });
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
      width: '580px'
    });
  }

  /**
   * Opens evacuee verification popup
   *
   * @param profile evacuee profile
   * @returns
   */
  openVerifyDialog(profile: RegistrantProfileModel) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: VerifyEvacueeDialogComponent,
        content: globalConst.verifyEvacueeProfile,
        profileData: profile
      },
      width: '620px'
    });
  }

  openEmailInviteDialog(email: string) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: BcscInviteDialogComponent,
        profileData: email
      },
      width: '600px'
    });
  }
}
