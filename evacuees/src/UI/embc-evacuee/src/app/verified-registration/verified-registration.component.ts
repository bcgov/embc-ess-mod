import { Component, OnInit } from '@angular/core';
import { FormCreationService } from '../core/services/formCreation.service';
import { NeedsAssessmentService } from '../sharedModules/components/needs-assessment/needs-assessment.service';

@Component({
  selector: 'app-verified-registration',
  templateUrl: './verified-registration.component.html',
  styleUrls: ['./verified-registration.component.scss'],
})
export class VerifiedRegistrationComponent implements OnInit {
  constructor(
    private formCreationService: FormCreationService,
    private needsAssessmentService: NeedsAssessmentService
  ) {
    this.needsAssessmentService.clearEvacuationFileNo();
    this.formCreationService.clearProfileData();
    this.formCreationService.clearNeedsAssessmentData();
  }

  ngOnInit(): void {}
}
