import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { TabModel } from 'src/app/core/model/tab.model';
import { EvacuationFileDataService } from '../evacuation-file/evacuation-file-data.service';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {

  currentFlow: string;
  activeFiles: number;
  evacuationFileWithTask: boolean;

  tabs: TabModel[] = [
    {
      label: 'Current Evacuations',
      route: 'current',
      activeImage: '/assets/images/curr-evac-active.svg',
      inactiveImage: '/assets/images/curr-evac.svg'
    },
    {
      label: 'Past Evacuations',
      route: 'past',
      activeImage: '/assets/images/past-evac-active.svg',
      inactiveImage: '/assets/images/past-evac.svg'
    },
    {
      label: 'User Profile',
      route: 'profile',
      activeImage: '/assets/images/profile-active.svg',
      inactiveImage: '/assets/images/profile.svg'
    }
  ];


  constructor(
    private route: ActivatedRoute, private needsAssessmentService: NeedsAssessmentService, public formCreationService: FormCreationService,
    private router: Router, private dialogService: DialogService, private cacheService: CacheService,
    public evacuationFilesDataService: EvacuationFileDataService) { }


  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    console.log(this.activeFiles);
    this.evacuationFileWithTask = false;

    setTimeout(() => {
      this.openReferenceNumberPopup();
    }, 500);
  }

  openDOBMismatchPopup(): void {
    this.dialogService.dateOfBirthMismatch('02 Mar 1984', '02 Mar 1983');
  }

  openReferenceNumberPopup(): void {

    const registrationResult = this.needsAssessmentService.getVerifiedEvacuationFileNo();

    if (registrationResult !== null) {
      this.dialogService.submissionCompleteDialog(registrationResult);
    }
  }

  startAssessment(): void {
    this.router.navigate(['/verified-registration/confirm-restriction']);
  }
}
