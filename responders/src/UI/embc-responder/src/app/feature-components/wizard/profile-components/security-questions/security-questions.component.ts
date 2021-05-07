import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';
import * as globalConst from '../../../../core/services/global-constants';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export class SecurityQuestionsComponent implements OnInit {
  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService
  ) {}

  ngOnInit(): void {}

  next(): void {
    this.stepCreateProfileService.setTabStatus(
      'security-questions',
      'complete'
    );
    if (this.stepCreateProfileService.checkTabsStatus()) {
      this.stepCreateProfileService.openModal(globalConst.wizardProfileMessage);
    } else {
      this.router.navigate(['/ess-wizard/create-evacuee-profile/review']);
    }
  }
}
