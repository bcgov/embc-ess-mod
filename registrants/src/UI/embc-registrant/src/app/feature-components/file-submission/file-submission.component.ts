import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BcscInviteDialogComponent } from 'src/app/core/components/dialog-components/bcsc-invite-dialog/bcsc-invite-dialog.component';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { FileSubmissionService } from './file-submission.service';
import * as globalConst from '../../core/services/globalConstants';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { InformationDialogComponent } from 'src/app/core/components/dialog-components/information-dialog/information-dialog.component';

@Component({
  selector: 'app-file-submission',
  templateUrl: './file-submission.component.html',
  styleUrls: ['./file-submission.component.scss']
})
export class FileSubmissionComponent implements OnInit {
  referenceNumber: string;
  panelOpenState = false;
  currentFlow: string;
  showLoader = false;
  subscription: Subscription;

  constructor(
    private needsAssessmentService: NeedsAssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private dialog: MatDialog,
    private profileDataService: ProfileDataService,
    private alertService: AlertService,
    private fileSubmissionService: FileSubmissionService
  ) {}

  /**
   * Initializes the user flow and fetches the registration
   * number
   */
  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    const registrationResult =
      this.needsAssessmentService.getNonVerifiedEvacuationFileNo();
    if (registrationResult) {
      this.referenceNumber = registrationResult.referenceNumber;
      if (!this.referenceNumber) {
        this.router.navigate(['/registration-method']);
      }
    }
  }

  /**
   * Navigates to dashboard page
   */
  goToProfile(): void {
    this.router.navigate(['/verified-registration/dashboard']);
  }

  verifyUser(): void {
    window.location.replace('/verified-registration');
  }

  sendEmail(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: BcscInviteDialogComponent,
          initDialog: this.profileDataService?.contactDetails?.email
        },
        width: '600px'
      })
      .afterClosed()
      .subscribe((emailId) => {
        if (emailId !== 'close') {
          this.showLoader = !this.showLoader;
          this.fileSubmissionService
            .inviteByEmail(emailId, this.referenceNumber)
            .subscribe({
              next: (value) => {
                this.showLoader = !this.showLoader;
                this.openSuccessModal(globalConst.successfulBcscInvite);
              },
              error: (error) => {
                this.showLoader = !this.showLoader;
                this.alertService.clearAlert();
                this.alertService.setAlert(
                  'danger',
                  globalConst.bcscInviteError
                );
              }
            });
        }
      });
  }

  /**
   * Open the dialog to indicate email has been sent successfully
   *
   * @param text Text to be displayed
   */
  private openSuccessModal(content: DialogContent): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      height: '270px',
      width: '530px'
    });
  }
}
