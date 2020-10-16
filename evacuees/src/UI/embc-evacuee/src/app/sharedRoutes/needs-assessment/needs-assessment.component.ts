import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DataService } from '../../core/services/data.service';

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
    private dataService: DataService) { }

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

        break;
      case 3:

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
    if (this.form.status === 'VALID') {
      if (isLast) {
        this.router.navigate(['/fileSubmission']);
      }
      this.setFormData(component);
      this.form$.unsubscribe();
      this.isComplete = !this.isComplete;
      stepper.next();
    } else {
      this.form.markAllAsTouched();
    }
  }

  setFormData(component: string): void {
    switch (component) {
      case 'evac-address':
        this.formCreationService.setEvacuatedForm(this.form);
        this.dataService.updateNeedsAssessment({ evacuatedFromAddress: this.form.get('evacuatedFromAddress').value });
        this.dataService.updateNeedsAssessment({ insurance: this.form.get('insurance').value });
        this.isComplete = false;
        break;
      case 'family-information':
        this.formCreationService.setFamilyMembersForm(this.form);
        this.dataService.updateNeedsAssessment({ haveMedication: this.form.get('haveMedication').value });
        this.dataService.updateNeedsAssessment({ haveSpecialDiet: this.form.get('haveSpecialDiet').value });
        this.dataService.updateNeedsAssessment({ familyMembers: this.form.get('familyMembers').value });
        this.isComplete = false;
        break;
      case 'pets':

        break;
      case 'identify-needs':

        break;
      default:
    }
  }
}
