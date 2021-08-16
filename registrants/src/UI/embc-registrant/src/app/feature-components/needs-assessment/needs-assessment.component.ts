import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { RegistrationResult } from '../../core/api/models/registration-result';
import { AlertService } from 'src/app/core/services/alert.service';
import { NonVerifiedRegistrationService } from '../non-verified-registration/non-verified-registration.services';
import { NeedsAssessmentService } from './needs-assessment.service';
import { EvacuationFileDataService } from '../../sharedModules/components/evacuation-file/evacuation-file-data.service';

@Component({
  selector: 'app-needs-assessment',
  templateUrl: './needs-assessment.component.html',
  styleUrls: ['./needs-assessment.component.scss']
})
export class NeedsAssessmentComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @ViewChild('needsStepper') private needsStepper: MatStepper;
  needsSteps: Array<ComponentMetaDataModel> =
    new Array<ComponentMetaDataModel>();
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
    private router: Router,
    private componentService: ComponentCreationService,
    private formCreationService: FormCreationService,
    private needsAssessmentService: NeedsAssessmentService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private nonVerifiedRegistrationService: NonVerifiedRegistrationService,
    private evacuationFileDataService: EvacuationFileDataService
  ) {
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
   *
   * @param index index of the step
   */
  loadStepForm(index: number): void {
    switch (index) {
      case 0:
        this.form$ = this.formCreationService
          .getEvacuatedForm()
          .subscribe((evacuatedForm) => {
            this.form = evacuatedForm;
          });
        break;
      case 1:
        this.form$ = this.formCreationService
          .getHouseholdMembersForm()
          .subscribe((householdMemberForm) => {
            this.form = householdMemberForm;
          });
        break;
      case 2:
        this.form$ = this.formCreationService
          .getPetsForm()
          .subscribe((petsForm) => {
            this.form = petsForm;
          });
        break;
      case 3:
        this.form$ = this.formCreationService
          .getIndentifyNeedsForm()
          .subscribe((identifyNeedsForm) => {
            this.form = identifyNeedsForm;
          });
        break;
      case 4:
        this.form$ = this.formCreationService
          .getSecretForm()
          .subscribe((secret) => {
            this.form = secret;
          });
        break;
    }
  }

  goBack(stepper: MatStepper, lastStep): void {
    if (lastStep === 0) {
      stepper.previous();
    } else if (lastStep === -1) {
      if (this.currentFlow === 'non-verified-registration') {
        this.router.navigate(
          ['/non-verified-registration/create-profile'],
          this.navigationExtras
        );
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
        this.evacuationFileDataService.evacuatedFromAddress = this.form.get(
          'evacuatedFromAddress'
        ).value;
        this.needsAssessmentService.insurance =
          this.form.get('insurance').value;
        break;
      case 'family-information':
        this.needsAssessmentService.haveSpecialDiet =
          this.form.get('haveSpecialDiet').value;
        this.needsAssessmentService.haveMedication =
          this.form.get('haveMedication').value;
        this.needsAssessmentService.specialDietDetails =
          this.form.get('specialDietDetails').value;
        this.needsAssessmentService.setHouseHoldMembers(
          this.form.get('householdMembers').value
        );
        break;
      case 'pets':
        this.needsAssessmentService.pets = this.form.get('pets').value;
        this.needsAssessmentService.hasPetsFood =
          this.form.get('hasPetsFood').value;
        break;
      case 'identify-needs':
        this.needsAssessmentService.setNeedsDetails(this.form);
        break;
      case 'secret':
        this.needsAssessmentService.secretWordPhrase =
          this.form.get('secretPhrase').value;
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
    this.nonVerifiedRegistrationService.submitRegistration().subscribe(
      (response: RegistrationResult) => {
        this.needsAssessmentService.setNonVerifiedEvacuationFileNo(response);
        this.router.navigate(['/non-verified-registration/file-submission']);
      },
      (error: any) => {
        console.log(error);
        this.showLoader = !this.showLoader;
        this.isSubmitted = !this.isSubmitted;
        this.alertService.setAlert('danger', error.error.title);
      }
    );
  }

  submitVerified(): void {
    this.showLoader = !this.showLoader;
    this.alertService.clearAlert();
    this.evacuationFileDataService.createEvacuationFile().subscribe(
      (value) => {
        console.log(value);
        this.needsAssessmentService.setVerifiedEvacuationFileNo(value);
        this.router.navigate(['/verified-registration/dashboard']);
      },
      (error: any) => {
        this.showLoader = !this.showLoader;
        this.isSubmitted = !this.isSubmitted;
        this.alertService.setAlert('danger', error);
      }
    );
  }

  allowSubmit($event: boolean): void {
    this.captchaPassed = $event;
  }
}
