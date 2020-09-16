import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentMetaDataModel } from '../core/model/componentMetaData.model';
import { ComponentCreationService } from '../core/services/componentCreation.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-needs-assessment',
  templateUrl: './needs-assessment.component.html',
  styleUrls: ['./needs-assessment.component.scss']
})
export class NeedsAssessmentComponent implements OnInit {

  needsSteps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  @ViewChild('needsStepper') private needsStepper: MatStepper;
  needsFolderPath = 'needs-assessment-forms';
  isEditable = true;

  constructor(private router: Router, private componentService: ComponentCreationService) {}

  ngOnInit(): void {
    this.needsSteps = this.componentService.createEvacSteps();
  }

  goBack(stepper: MatStepper, lastStep): void {
    if (lastStep === 0) {
      stepper.previous();
    } else if (lastStep === -1) {
      this.router.navigate(['/loader/registration/last']);
    }
  }

  goForward(stepper: MatStepper, isLast: boolean): void {
    if (isLast) {
      // this.showStep = !this.showStep;
      this.router.navigate(['/fileSubmission']);
    }
    stepper.next();
  }

}
