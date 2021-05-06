import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';

@Component({
  selector: 'app-collection-notice',
  templateUrl: './collection-notice.component.html',
  styleUrls: ['./collection-notice.component.scss']
})
export class CollectionNoticeComponent implements OnInit {
  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService
  ) {}

  ngOnInit(): void {}

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    this.stepCreateProfileService.setTabStatus('collection-notice', 'complete');
    this.router.navigate(['/ess-wizard/create-evacuee-profile/restriction']);
  }
}
