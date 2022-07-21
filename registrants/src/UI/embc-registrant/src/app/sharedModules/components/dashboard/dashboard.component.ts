import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { TabModel } from 'src/app/core/model/tab.model';
import { NeedsAssessmentService } from '../../../feature-components/needs-assessment/needs-assessment.service';
import { EvacuationFileDataService } from '../evacuation-file/evacuation-file-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { EssFileDialogComponent } from 'src/app/core/components/dialog-components/ess-file-dialog/ess-file-dialog.component';
import * as globalConst from '../../../core/services/globalConstants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
    const registrationResult =
      this.needsAssessmentService.getVerifiedEvacuationFileNo();

    if (registrationResult !== null) {
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
          this.needsAssessmentService.setVerifiedEvacuationFileNo(
            this.emptyRegistrationResult
          );
        });
    }
  }

  startAssessment(): void {
    this.router.navigate(['/verified-registration/confirm-restriction']);
  }
}
