import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormCreationService } from '../core/services/formCreation.service';
import { LoginService } from '../core/services/login.service';
import { NeedsAssessmentService } from '../feature-components/needs-assessment/needs-assessment.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  constructor(
    private router: Router,
    private formCreationService: FormCreationService,
    private needsAssessmentService: NeedsAssessmentService,
    private loginService: LoginService
  ) {
    this.loginService.logout();
  }
  ngOnInit(): void {
    this.needsAssessmentService.clearEvacuationFileNo();
    this.formCreationService.clearProfileData();
    this.formCreationService.clearNeedsAssessmentData();
  }

  verifyUser(): void {
    this.router.navigate(['/verified-registration']);
  }

  nonVerifiedUser(): void {
    this.router.navigate(['/non-verified-registration/collection-notice']);
  }
}
