import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';
import { WizardService } from '../../wizard.service';

@Component({
  selector: 'app-profile-review',
  templateUrl: './profile-review.component.html',
  styleUrls: ['./profile-review.component.scss']
})
export class ProfileReviewComponent implements OnInit {
  verifiedProfileFC: FormControl = null;

  displayAnswer1: string;
  displayAnswer2: string;
  displayAnswer3: string;

  constructor(
    private router: Router,
    private wizardService: WizardService,
    private formBuilder: FormBuilder,
    public stepCreateProfileService: StepCreateProfileService
  ) {}

  ngOnInit(): void {
    // Replace security question answers with asterisks of same length
    if (!this.stepCreateProfileService.bypassSecurityQuestions) {
      const displayRegex = /./g;

      this.displayAnswer1 = this.stepCreateProfileService.securityQuestions[0].answer.replace(
        displayRegex,
        '*'
      );

      this.displayAnswer2 = this.stepCreateProfileService.securityQuestions[1].answer.replace(
        displayRegex,
        '*'
      );

      this.displayAnswer3 = this.stepCreateProfileService.securityQuestions[2].answer.replace(
        displayRegex,
        '*'
      );
    }

    // Set up form validation for verification check
    this.verifiedProfileFC = new FormControl(
      this.stepCreateProfileService.verifiedProfile,
      Validators.required
    );
  }

  /**
   * Go back to the Security Questions tab
   */
  back(): void {
    this.router.navigate([
      '/ess-wizard/create-evacuee-profile/security-questions'
    ]);
  }

  /**
   * Updates the tab status, step status and navigates
   * to the next step
   */
  save(): void {
    if (this.verifiedProfileFC.valid) {
      this.stepCreateProfileService.setTabStatus('review', 'complete');
      this.wizardService.setStepStatus('/ess-wizard/create-ess-file', false);
    } else {
      this.verifiedProfileFC.markAsTouched();
    }

    // this.router.navigate(['/ess-wizard/create-ess-file'], {
    //   state: { step: 'STEP 2', title: 'Create ESS File' }
    // });
  }
}
