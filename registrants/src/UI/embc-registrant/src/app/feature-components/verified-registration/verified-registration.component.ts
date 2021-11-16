import { Component, OnInit } from '@angular/core';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';

@Component({
  selector: 'app-verified-registration',
  templateUrl: './verified-registration.component.html',
  styleUrls: ['./verified-registration.component.scss']
})
export class VerifiedRegistrationComponent implements OnInit {
  constructor(private needsAssessmentService: NeedsAssessmentService) {
    this.needsAssessmentService.clearEvacuationFileNo();
  }

  ngOnInit(): void {}
}
