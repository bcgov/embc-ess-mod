import { Component, OnInit } from '@angular/core';
import { FormCreationService } from '../../core/services/formCreation.service';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';

@Component({
  selector: 'app-non-verified-registration',
  templateUrl: './non-verified-registration.component.html',
  styleUrls: ['./non-verified-registration.component.scss']
})
export class NonVerifiedRegistrationComponent implements OnInit {
  constructor(
    private formCreationService: FormCreationService,
    private needsAssessmentService: NeedsAssessmentService
  ) {}

  ngOnInit(): void {
    // this.needsAssessmentService.clearEvacuationFileNo();
    // this.formCreationService.clearProfileData();
    // this.formCreationService.clearNeedsAssessmentData();
  }
}
