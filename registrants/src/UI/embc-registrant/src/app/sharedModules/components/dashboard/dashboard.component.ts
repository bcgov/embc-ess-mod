import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { TabModel } from 'src/app/core/model/tab.model';
import { NeedsAssessmentService } from '../../../feature-components/needs-assessment/needs-assessment.service';
import { EvacuationFileDataService } from '../evacuation-file/evacuation-file-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { EssFileDialogComponent } from 'src/app/core/components/dialog-components/ess-file-dialog/ess-file-dialog.component';
import * as globalConst from '../../../core/services/globalConstants';
import { MatTabsModule } from '@angular/material/tabs';
import { AlertComponent } from '../../../core/components/alert/alert.component';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SelfServeSubmissionDialogComponent } from 'src/app/core/components/dialog-components/self-serve-submissoin-dialog/self-serve-submission-dialog.component';
import { EssFileUpdatePendingOrExpiredDialogComponent } from 'src/app/core/components/dialog-components/ess-file-update-pending-or-expired-dialog/ess-file-update-pending-or-expired-dialog.component';
import { EssFileUpdateActiveDialogComponent } from 'src/app/core/components/dialog-components/ess-file-update-active-dialog/ess-file-update-active-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    AlertComponent,
    MatTabsModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    AsyncPipe
  ]
})
export class DashboardComponent implements OnInit {
  currentFlow: string;
  activeFiles: number;
  emptyRegistrationResult: string = null;

  tabs: TabModel[] = [
    {
      label: 'Current Events',
      route: 'current',
      activeImage: '/assets/images/curr-evac-active.svg',
      inactiveImage: '/assets/images/curr-evac.svg'
    },
    {
      label: 'Past Events',
      route: 'past',
      activeImage: '/assets/images/past-evac-active.svg',
      inactiveImage: '/assets/images/past-evac.svg'
    },
    {
      label: 'Profile',
      route: 'profile',
      activeImage: '/assets/images/profile-active.svg',
      inactiveImage: '/assets/images/profile.svg'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private needsAssessmentService: NeedsAssessmentService,
    public formCreationService: FormCreationService,
    private router: Router,
    public evacuationFilesDataService: EvacuationFileDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;

    setTimeout(() => {
      this.openReferenceNumberPopup();
    }, 500);
  }

  openReferenceNumberPopup(): void {
    const registrationResult = this.needsAssessmentService.getVerifiedEvacuationFileNo();

    if (registrationResult !== null) {
      const {
        isNeedsAssessmentUpdatePendingOrExpiredEssFile = false,
        isNeedsAssessmentUpdateActiveEssFileForSupports = false,
        isNeedsAssessmentUpdateActiveEssFileForSupportWithExtensions = false,
        selfServe = false,
        supportData = null
      } = this.router.lastSuccessfulNavigation.extras?.state ?? {
        isNeedsAssessmentUpdatePendingOrExpiredEssFile: false,
        isNeedsAssessmentUpdateActiveEssFileForSupports: false,
        isNeedsAssessmentUpdateActiveEssFileForSupportWithExtensions: false,
        selfServe: false,
        supportData: null
      };

      if (selfServe) {
        this.dialog
          .open(SelfServeSubmissionDialogComponent, {
            data: supportData,
            width: '80%',
            height: 'auto',
            maxWidth: '900px'
          })
          .afterClosed()
          .subscribe(() => {
            this.needsAssessmentService.setVerifiedEvacuationFileNo(this.emptyRegistrationResult);
          });
      } else if (
        isNeedsAssessmentUpdateActiveEssFileForSupports ||
        isNeedsAssessmentUpdateActiveEssFileForSupportWithExtensions
      ) {
        this.dialog
          .open(EssFileUpdateActiveDialogComponent, {
            width: '80%',
            height: 'auto',
            maxWidth: '900px',
            data: {
              supportWithExtensions: isNeedsAssessmentUpdateActiveEssFileForSupportWithExtensions
            }
          })
          .afterClosed()
          .subscribe(() => {
            this.needsAssessmentService.setVerifiedEvacuationFileNo(this.emptyRegistrationResult);
          });
      } else if (isNeedsAssessmentUpdatePendingOrExpiredEssFile) {
        this.dialog
          .open(EssFileUpdatePendingOrExpiredDialogComponent, {
            width: '80%',
            height: 'auto',
            maxWidth: '900px'
          })
          .afterClosed()
          .subscribe(() => {
            this.needsAssessmentService.setVerifiedEvacuationFileNo(this.emptyRegistrationResult);
          });
      } else {
        this.dialog
          .open(DialogComponent, {
            data: {
              component: EssFileDialogComponent,
              content: globalConst.newEssFile,
              essFileData: registrationResult,
              initDialog: false
            },
            width: '700px',
            height: '750px'
          })
          .afterClosed()
          .subscribe(() => {
            this.needsAssessmentService.setVerifiedEvacuationFileNo(this.emptyRegistrationResult);
          });
      }
    }
  }

  startAssessment(): void {
    this.router.navigate(['/verified-registration/needs-assessment']);
  }
}
