import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ComponentMetaDataModel } from '../../../core/model/componentMetaData.model';
import { ComponentCreationService } from '../../../core/services/componentCreation.service';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../../core/services/formCreation.service';
import { DataUpdationService } from '../../../core/services/dataUpdation.service';
import { DataSubmissionService } from '../../../core/services/dataSubmission.service';
import { RegistrationResult } from 'src/app/core/services/api/models/registration-result';

@Component({
  selector: 'app-needs-assessment',
  templateUrl: './needs-assessment.component.html',
  styleUrls: ['./needs-assessment.component.scss']
})
export class NeedsAssessmentComponent implements OnInit, AfterViewInit, AfterViewChecked {

  needsSteps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  @ViewChild('needsStepper') private needsStepper: MatStepper;
  needsFolderPath = 'needs-assessment-forms';
  isEditable = true;
  form$: Subscription;
  form: FormGroup;
  isComplete: boolean;
  navigationExtras: NavigationExtras = { state: { stepIndex: 3 } };
  captchaPassed = false;
  stepToDisplay: number;
  type = 'both';

  constructor(private router: Router, private componentService: ComponentCreationService, private formCreationService: FormCreationService,
              private updateService: DataUpdationService, private submissionService: DataSubmissionService, private cd: ChangeDetectorRef) {
      const navigation = this.router.getCurrentNavigation();
      if (navigation.extras.state !== undefined) {
        const state = navigation.extras.state as { stepIndex: number };
        this.stepToDisplay = state.stepIndex;
      }
     }

  ngOnInit(): void {
    this.needsSteps = this.componentService.createEvacSteps();
  }


  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this.stepToDisplay === 4) {
      this.isComplete = true;
      setTimeout(() => {
        this.needsStepper.selectedIndex = this.stepToDisplay;
      }, 0);
    }
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

  submitFile(): void {
    this.submissionService.submitRegistrationFile().subscribe((response: RegistrationResult) => {
      console.log(response);
      this.updateService.updateRegisrationResult(response);
      this.router.navigate(['/non-verified-registration/fileSubmission']);
    }, (error) => {
      console.log(error);
    });

  }

  allowSubmit($event: boolean): void {
    console.log($event);
    this.captchaPassed = $event;
  }
}
