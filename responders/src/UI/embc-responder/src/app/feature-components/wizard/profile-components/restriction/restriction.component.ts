import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';

@Component({
  selector: 'app-restriction',
  templateUrl: './restriction.component.html',
  styleUrls: ['./restriction.component.scss']
})
export class RestrictionComponent implements OnInit {
  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService
  ) {}

  ngOnInit(): void {}

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    this.stepCreateProfileService.setTabStatus('restriction', 'complete');
    this.router.navigate(['/ess-wizard/create-evacuee-profile/security-questions']);
  }
}
