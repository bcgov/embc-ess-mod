import { Component, OnInit } from '@angular/core';
import { TimeoutService } from 'src/app/core/services/timeout.service';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';

@Component({
  selector: 'app-verified-registration',
  templateUrl: './verified-registration.component.html',
  styleUrls: ['./verified-registration.component.scss']
})
export class VerifiedRegistrationComponent implements OnInit {
  constructor(
    private needsAssessmentService: NeedsAssessmentService,
    private timeOutService: TimeoutService
  ) {
    this.needsAssessmentService.clearEvacuationFileNo();
  }

  ngOnInit(): void {
    this.timeOutService.init(
      this.timeOutService.timeOutInfo.sessionTimeoutInMinutes,
      this.timeOutService.timeOutInfo.warningMessageDuration
    );
  }
}
