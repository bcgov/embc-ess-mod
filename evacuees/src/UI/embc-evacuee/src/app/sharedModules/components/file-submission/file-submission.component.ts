import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';

@Component({
  selector: 'app-file-submission',
  templateUrl: './file-submission.component.html',
  styleUrls: ['./file-submission.component.scss'],
})
export class FileSubmissionComponent implements OnInit {
  referenceNumber: string;
  panelOpenState = false;
  currentFlow: string;

  subscription: Subscription;

  constructor(
    private needsAssessmentService: NeedsAssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location
  ) {}

  /**
   * Initializes the user flow and fetches the registration
   * number
   */
  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    const registrationResult =
      this.needsAssessmentService.getNonVerifiedEvacuationFileNo();
    if (registrationResult) {
      this.referenceNumber = registrationResult.referenceNumber;
      if (!this.referenceNumber) {
        console.log(this.referenceNumber);
        this.router.navigate(['/registration-method']);
      }
    }

    // this.router.events.pipe(filter((event: any) => event instanceof NavigationStart)).subscribe(event => {
    //   console.log(event);
    // })
  }

  /**
   * Navigates to dashboard page
   */
  goToProfile(): void {
    this.router.navigate(['/verified-registration/dashboard']);
  }

  verifyUser(): void {
    window.location.replace('/verified-registration');
  }
}
