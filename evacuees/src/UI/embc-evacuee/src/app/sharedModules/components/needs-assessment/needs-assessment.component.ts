import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ComponentMetaDataModel } from '../../../core/model/componentMetaData.model';
import { ComponentCreationService } from '../../../core/services/componentCreation.service';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../../core/services/formCreation.service';
import { DataUpdationService } from '../../../core/services/dataUpdation.service';
import { RegistrationResult } from '../../../core/api/models/registration-result';
import { AlertService } from 'src/app/core/services/alert.service';
import { NonVerifiedRegistrationService } from '../../../non-verified-registration/non-verified-registration.services';
import { EvacuationFileService } from '../evacuation-file/evacuation-file.service';

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
  navigationExtras: NavigationExtras = { state: { stepIndex: 3 } };
  captchaPassed = false;
  stepToDisplay: number;
  type: string;
  currentFlow: string;
  parentPageName = 'needs-assessment';
  showLoader = false;
  isSubmitted = false;

  constructor(
    private router: Router, private componentService: ComponentCreationService, private formCreationService: FormCreationService,
    private updateService: DataUpdationService, private cd: ChangeDetectorRef, private route: ActivatedRoute,
    private alertService: AlertService, private nonVerifiedRegistrationService: NonVerifiedRegistrationService,
    private evacuationFileService: EvacuationFileService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state !== undefined) {
      const state = navigation.extras.state as { stepIndex: number };
      this.stepToDisplay = state.stepIndex;
    }
  }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    if (this.currentFlow === 'non-verified-registration') {
      this.type = 'both';
    } else {
      this.type = 'need';
    }
    this.needsSteps = this.componentService.createEvacSteps();
  }


  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this.stepToDisplay === 4) {
      setTimeout(() => {
        this.needsStepper.selectedIndex = this.stepToDisplay;
      }, 0);
    }
  }

  currentStep(index: number): void {
    this.loadStepForm(index);
  }

  stepChanged(event: any, stepper: MatStepper): void {
    stepper.selected.interacted = false;
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
      if (this.currentFlow === 'non-verified-registration') {
        this.router.navigate(['/non-verified-registration/create-profile'], this.navigationExtras);
      } else {
        this.router.navigate(['/verified-registration/confirm-restriction']);
      }
    }
  }

  goForward(stepper: MatStepper, isLast: boolean, component: string): void {
    if (isLast) {
      this.submitFile();
    } else {
      if (this.form.status === 'VALID') {
        this.setFormData(component);
        this.form$.unsubscribe();
        stepper.selected.completed = true;
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
        break;
      case 'family-information':
        this.updateService.updateFamilyMemberDetails(this.form);
        break;
      case 'pets':
        this.updateService.updatePetsDetails(this.form);
        break;
      case 'identify-needs':
        this.updateService.updateNeedsDetails(this.form);
        break;
      default:
    }
  }

  submitFile(): void {
    if (this.currentFlow === 'non-verified-registration') {
      this.submitNonVerified();
    } else {
      this.submitVerified();
    }
  }

  submitNonVerified(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.alertService.clearAlert();
    this.nonVerifiedRegistrationService.submitRegistration().subscribe((response: RegistrationResult) => {
      console.log(response);
      this.updateService.updateRegisrationResult(response);
      this.router.navigate(['/non-verified-registration/file-submission']);
    }, (error: any) => {
      console.log(error);
      this.showLoader = !this.showLoader;
      this.isSubmitted = !this.isSubmitted;
      this.alertService.setAlert('danger', error.error.title);
    });

  }

  submitVerified(): void {
    this.showLoader = !this.showLoader;
    this.alertService.clearAlert();
    this.evacuationFileService.createEvacuationFile().subscribe((response: string) => {
      console.log(response);
      const registrationResult: RegistrationResult = { referenceNumber: response };
      this.updateService.updateRegisrationResult(registrationResult);
      this.router.navigate(['/verified-registration/dashboard']);
    }, (error: any) => {
      console.log(error.error.title);
      this.showLoader = !this.showLoader;
      this.isSubmitted = !this.isSubmitted;
      this.alertService.setAlert('danger', error.error.title);
    });

    // this.router.navigate(['/verified-registration/fileSubmission']);

  }

  allowSubmit($event: boolean): void {
    this.captchaPassed = $event;
  }
}
