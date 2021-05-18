import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';

@Component({
  selector: 'app-collection-notice',
  templateUrl: './collection-notice.component.html',
  styleUrls: ['./collection-notice.component.scss']
})
export class CollectionNoticeComponent implements OnDestroy {
  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService
  ) {}

  ngOnDestroy(): void {
    this.stepCreateProfileService.setTabStatus('collection-notice', 'complete');
  }

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    this.router.navigate(['/ess-wizard/create-evacuee-profile/restriction']);
  }
}
