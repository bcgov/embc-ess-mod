import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DataUpdationService } from '../../core/services/dataUpdation.service';

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
  form$: Subscription;
  form: FormGroup;
  isComplete: boolean;
  navigationExtras: NavigationExtras = { state: { stepIndex: 3 } };

  constructor(private router: Router, private componentService: ComponentCreationService, private formCreationService: FormCreationService,
    private updateService: DataUpdationService) { }

  ngOnInit(): void {
    this.needsSteps = this.componentService.createEvacSteps();
  }

  currentStep(index: number): void {
    this.loadStepForm(index);
  }

  /**
   * Loads appropriate forms based on the current step
   * @param index index of the step
   */
  loadStepForm(index: number): void {
    switch (index) {
      case 0:
        this.form$ = this.formCreationService.getEvacuatedForm().subscribe(
          evacuatedForm => {
            this.form = evacuatedForm;
          }
        );
        break;
      case 1:
        this.form$ = this.formCreationService.getFamilyMembersForm().subscribe(
          memberForm => {
            this.form = memberForm;
          }
        );
        break;
      case 2:
        this.form$ = this.formCreationService.getPetsForm().subscribe(
          petsForm => {
            this.form = petsForm;
          }
        );
        break;
      case 3:
        this.form$ = this.formCreationService.getIndentifyNeedsForm().subscribe(
          identifyNeedsForm => {
            this.form = identifyNeedsForm;
          }
        );
        break;
    }
  }

  goBack(stepper: MatStepper, lastStep): void {
    if (lastStep === 0) {
      stepper.previous();
    } else if (lastStep === -1) {
      this.router.navigate(['/non-verified-registration/create-profile'], this.navigationExtras);
    }
  }

  goForward(stepper: MatStepper, isLast: boolean, component: string): void {
    if (isLast) {
      this.submitFile();
      this.router.navigate(['/non-verified-registration/fileSubmission']);
    } else {
      if (this.form.status === 'VALID') {
        this.setFormData(component);
        this.form$.unsubscribe();
        this.isComplete = !this.isComplete;
        stepper.next();
      } else {
        this.form.markAllAsTouched();
      }
    }
  }

  setFormData(component: string): void {
    switch (component) {
      case 'evac-address':
        this.updateService.updateEvacuationDetails(this.form);
        this.isComplete = false;
        break;
      case 'family-information':
        this.updateService.updateFamilyMemberDetails(this.form);
        this.isComplete = false;
        break;
      case 'pets':
        this.updateService.updatePetsDetails(this.form);
        this.isComplete = false;
        break;
      case 'identify-needs':
        this.updateService.updateNeedsDetails(this.form);
        break;
      default:
    }
  }

  submitFile() {

  }
}
