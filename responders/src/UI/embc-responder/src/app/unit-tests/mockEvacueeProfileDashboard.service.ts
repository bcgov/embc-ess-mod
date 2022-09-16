import { Injectable } from '@angular/core';
import { EvacueeProfileDashboardService } from '../feature-components/search/evacuee-profile-dashboard/evacuee-profile-dashboard.service';
import * as globalConst from '../core/services/global-constants';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { VerifyEvacueeDialogComponent } from '../shared/components/dialog-components/verify-evacuee-dialog/verify-evacuee-dialog.component';
import { RegistrantProfileModel } from '../core/models/registrant-profile.model';
import { BcscInviteDialogComponent } from '../shared/components/dialog-components/bcsc-invite-dialog/bcsc-invite-dialog.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockEvacueeProfileDashboardService extends EvacueeProfileDashboardService {
  fileLinkStatus: string;
  verifyDialogRef: any;
  serviceCardInviteDialogRef: any;

  /**
   * Displays file linking dialog boxes
   */
  showFileLinkingPopups() {
    if (this.fileLinkStatus === 'S') {
      this.openLinkDialog(globalConst.essFileLinkMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.resetLinkingFlags();
          }
        });
    } else if (this.fileLinkStatus === 'E') {
      this.openLinkDialog(globalConst.essFileLinkErrorMessage)
        .afterClosed()
        .subscribe({
          next: (value) => {
            this.resetLinkingFlags();
          }
        });
    }
  }

  openVerifyDialog(profile: RegistrantProfileModel) {
    this.verifyDialogRef = this.dialog.open(DialogComponent, {
      data: {
        component: VerifyEvacueeDialogComponent,
        content: globalConst.verifyEvacueeProfile,
        profileData: profile
      },
      width: '620px'
    });

    return this.verifyDialogRef;
  }

  closeVerifyDialog() {
    this.verifyDialogRef.close('verified');
  }

  closeUnVerifiedDialog() {
    this.verifyDialogRef.close('');
  }

  openEmailInviteDialog(email: string) {
    this.serviceCardInviteDialogRef = this.dialog.open(DialogComponent, {
      data: {
        component: BcscInviteDialogComponent,
        profileData: email
      },
      width: '600px'
    });
    return this.serviceCardInviteDialogRef;
  }

  closeEmailInviteDialog() {
    this.serviceCardInviteDialogRef.close('unit@test.com');
  }

  inviteByEmail(address: string, registrantId: string): Observable<void> {
    return new BehaviorSubject<void>(null);
  }
}
