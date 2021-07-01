import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';

@Component({
  selector: 'app-collection-notice',
  templateUrl: './collection-notice.component.html',
  styleUrls: ['./collection-notice.component.scss']
})
export class CollectionNoticeComponent implements OnDestroy {
  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService
  ) {}

  ngOnDestroy(): void {
    this.stepEvacueeProfileService.setTabStatus(
      'collection-notice',
      'complete'
    );
  }

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    this.router.navigate(['/ess-wizard/evacuee-profile/restriction']);
  }
}
