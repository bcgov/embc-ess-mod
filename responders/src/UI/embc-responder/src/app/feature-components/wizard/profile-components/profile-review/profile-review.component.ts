import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';
import { WizardService } from '../../wizard.service';

@Component({
  selector: 'app-profile-review',
  templateUrl: './profile-review.component.html',
  styleUrls: ['./profile-review.component.scss']
})
export class ProfileReviewComponent implements OnInit {
  constructor(
    private router: Router,
    private wizardService: WizardService,
    private stepCreateProfileService: StepCreateProfileService
  ) {}

  ngOnInit(): void {}

  /**
   * Updates the tab status, step status and navigates
   * to the next step
   */
  save(): void {
    console.log("in save")
    this.stepCreateProfileService.setTabStatus('review', 'complete');
    this.wizardService.setStepStatus('/ess-wizard/create-ess-file', false);
    this.router.navigate(['/ess-wizard/create-ess-file'], {
      state: { step: 'STEP 2', title: 'Create ESS File' }
    });
  }
}
