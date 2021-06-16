import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';

@Component({
  selector: 'app-ess-file-review',
  templateUrl: './ess-file-review.component.html',
  styleUrls: ['./ess-file-review.component.scss']
})
export class EssFileReviewComponent implements OnInit, OnDestroy {
  taskNumber: string;
  tabUpdateSubscription: Subscription;

  evacAddressDisplay: string;
  referredServicesDisplay: string;

  constructor(
    public stepCreateEssFileService: StepCreateEssFileService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userProfile = this.userService.currentProfile;
    this.taskNumber = userProfile.taskNumber;

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

  /**
   * Go back to the Security Phrase tab
   */
  back(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/security-phrase']);
  }

  /**
   * Create or update ESS File and continue to Step 3
   */
  save(): void {
    this.stepCreateEssFileService.nextTabUpdate.next();
  }

  /**
   * Checks the wizard validity and updates the tab status
   */
  updateTabStatus() {
    // If all other tabs are complete and this tab has been viewed, mark complete
    if (!this.stepCreateEssFileService.checkTabsStatus()) {
      this.stepCreateEssFileService.setTabStatus('review', 'complete');
    }
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
