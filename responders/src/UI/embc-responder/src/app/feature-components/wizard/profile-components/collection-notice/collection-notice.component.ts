import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabModel } from 'src/app/core/models/tab.model';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';

/**
 * Displays the collection notice
 */
@Component({
  selector: 'app-collection-notice',
  templateUrl: './collection-notice.component.html',
  styleUrls: ['./collection-notice.component.scss']
})
export class CollectionNoticeComponent implements OnInit, OnDestroy {
  tabMetaData: TabModel;
  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService
  ) {}

  ngOnInit(): void {
    this.tabMetaData =
      this.stepEvacueeProfileService.getNavLinks('collection-notice');
  }

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
    this.router.navigate([this.tabMetaData?.next]);
  }
}
