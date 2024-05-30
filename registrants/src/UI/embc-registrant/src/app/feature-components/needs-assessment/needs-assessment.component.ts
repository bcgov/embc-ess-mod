import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { ComponentCreationService, NeedsAssessmentSteps } from '../../core/services/componentCreation.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { RegistrationResult } from '../../core/api/models/registration-result';
import { AlertService } from 'src/app/core/services/alert.service';
import { NonVerifiedRegistrationService } from '../non-verified-registration/non-verified-registration.services';
import { NeedsAssessmentService } from './needs-assessment.service';
import { EvacuationFileDataService } from '../../sharedModules/components/evacuation-file/evacuation-file-data.service';
import * as globalConst from '../../core/services/globalConstants';
import { switchMap, take, tap } from 'rxjs/operators';
import { CaptchaResponse, CaptchaResponseType } from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { AppLoaderComponent } from '../../core/components/app-loader/app-loader.component';
import { AlertComponent } from '../../core/components/alert/alert.component';
import { ReviewComponent } from '../review/review.component';
import { MatButtonModule } from '@angular/material/button';
import { ComponentWrapperComponent } from '../../sharedModules/components/component-wrapper/component-wrapper.component';
import { DraftSupports, EligibilityCheck, EvacuationFileStatus } from 'src/app/core/api/models';
import { SupportsService } from 'src/app/core/api/services';
import { input } from '@angular/core';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-needs-assessment',
  templateUrl: './needs-assessment.component.html',
  styleUrls: ['./needs-assessment.component.scss'],
  standalone: true,
  imports: [
    MatStepperModule,
    ComponentWrapperComponent,
    MatButtonModule,
    ReviewComponent,
    AlertComponent,
    AppLoaderComponent
  ]
})
export class NeedsAssessmentComponent implements OnInit, AfterViewInit, AfterViewChecked {
  essFileId = input<string | undefined>();

  @ViewChild('needsStepper') private needsStepper: MatStepper;
  needsSteps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  needsFolderPath = 'needs-assessment-forms';
  isEditable = true;
  form$: Subscription;
  form: UntypedFormGroup;
  navigationExtras: NavigationExtras = { state: { stepIndex: 3 } };
  captchaPassed = false;
  stepToDisplay: number;
  type: string;
  currentFlow: string;
  parentPageName = 'needs-assessment';
  showLoader = false;
  isSubmitted = false;
  captchaResponse: CaptchaResponse;

  editFromReview: boolean = false;
  copyCurrentStepFormValue: any;

  resetIdentifyNeeds = true;

  constructor(
    private router: Router,
    private componentService: ComponentCreationService,
    private formCreationService: FormCreationService,
    private needsAssessmentService: NeedsAssessmentService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private nonVerifiedRegistrationService: NonVerifiedRegistrationService,
    private evacuationFileDataService: EvacuationFileDataService,
    private supportsService: SupportsService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation !== null) {
      if (navigation.extras.state !== undefined) {
        const state = navigation.extras.state as { stepIndex: number };
        this.stepToDisplay = state.stepIndex;
      }
    }
  }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    if (this.currentFlow === 'non-verified-registration') {
      this.type = 'both';
    } else {
      this.type = 'need';
    }
    this.needsSteps = this.componentService
      .createEvacSteps()
      .filter(
        (s) =>
          this.evacuationFileDataService.evacuationFileStatus !== EvacuationFileStatus.Active ||
          (this.evacuationFileDataService.evacuationFileStatus === EvacuationFileStatus.Active &&
            (s.component as unknown as string) !== NeedsAssessmentSteps.EvacAddress)
      );

    this.needsSteps[0].lastStep = -1;
    this.needsSteps[0].backButtonLabel = 'Cancel & Go Back to My Profile';
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this.stepToDisplay === 4) {
      this.needsStepper.linear = false;
      setTimeout(() => {
        this.needsStepper.selectedIndex = this.stepToDisplay;
        this.needsStepper.linear = true;
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
    const step = this.needsSteps?.[index]?.component as unknown as NeedsAssessmentSteps;

    switch (step) {
      case NeedsAssessmentSteps.EvacAddress:
        this.form$ = this.formCreationService.getEvacuatedForm().subscribe((evacuatedForm) => {
          this.form = evacuatedForm;
          this.copyCurrentStepFormValue = this.form.getRawValue();
        });
        break;

      case NeedsAssessmentSteps.FamilyAndPetsInformation:
        this.form$ = combineLatest([
          this.formCreationService.getHouseholdMembersForm(),
          this.formCreationService.getPetsForm()
        ]).subscribe(([householdMemberForm, petsForm]) => {
          this.form = new FormGroup({ householdMemberForm, petsForm });
          this.copyCurrentStepFormValue = this.form.getRawValue();
        });
        break;

      case NeedsAssessmentSteps.IdentifyNeeds:
        this.form$ = this.formCreationService.getIndentifyNeedsForm().subscribe((identifyNeedsForm) => {
          // reset identify needs selection if extending supports with an active ess file
          if (
            this.resetIdentifyNeeds &&
            this.essFileId() &&
            this.evacuationFileDataService.evacuationFileStatus === EvacuationFileStatus.Active
          ) {
            identifyNeedsForm.reset();
            // reset only once on load, so set the flag to false
            this.resetIdentifyNeeds = false;
          }

          this.form = identifyNeedsForm;
          this.copyCurrentStepFormValue = this.form.getRawValue();
        });
        break;

      case NeedsAssessmentSteps.Secret:
        this.form$ = this.formCreationService.getSecretForm().subscribe((secret) => {
          this.form = secret;
          this.copyCurrentStepFormValue = this.form.getRawValue();
        });
        break;

      default:
        break;
    }
  }

  editStep(step: string) {
    const stepIndex = this.needsSteps.findIndex(
      (stepComponent) => (stepComponent.component as unknown as string) === step
    );
    this.editFromReview = true;
    this.needsStepper.selectedIndex = stepIndex;
  }

  goBack(stepper: MatStepper, lastStep): void {
    if (lastStep === 0) {
      stepper.previous();
    } else if (lastStep === -1) {
      if (this.currentFlow === 'non-verified-registration') {
        this.router.navigate(['/non-verified-registration/create-profile'], this.navigationExtras);
      } else {
        this.router.navigate(['/verified-registration/dashboard']);
      }
    }
  }

  goForward(stepper: MatStepper, isLast: boolean, component: string | Observable<any>): void {
    if (isLast) {
      this.submitFile();
    } else {
      if (this.form.status === 'VALID') {
        this.setFormData(component as string);
        this.form$.unsubscribe();
        stepper.selected.completed = true;
        stepper.next();
      } else {
        this.form.markAllAsTouched();
      }
    }
  }

  cancelAndGoBackToReview() {
    // revert the form changes on cancel and do not emit event
    this.form.setValue(this.copyCurrentStepFormValue, { emitEvent: false });

    this.editFromReview = false;
    this.needsStepper.selectedIndex = this.needsStepper.steps.length - 1;
  }

  goBackToReview() {
    this.editFromReview = false;
    this.needsStepper.selectedIndex = this.needsStepper.steps.length - 1;
  }

  setFormData(component: string): void {
    const step = component as NeedsAssessmentSteps;
    switch (step) {
      case NeedsAssessmentSteps.EvacAddress:
        this.evacuationFileDataService.evacuatedAddress = this.form.get('evacuatedFromAddress').value;
        this.needsAssessmentService.insurance = this.form.get('insurance').value;
        break;
      case NeedsAssessmentSteps.FamilyAndPetsInformation:
        this.needsAssessmentService.setHouseHoldMembers(this.form.get('householdMemberForm').value.householdMembers);

        this.needsAssessmentService.pets = this.form.get('petsForm').value.pets;
        break;
      case NeedsAssessmentSteps.IdentifyNeeds:
        this.needsAssessmentService.setNeedsDetails(this.form);
        break;
      case NeedsAssessmentSteps.Secret:
        this.evacuationFileDataService.secretPhrase = this.form.get('secretPhrase').value;
        this.evacuationFileDataService.secretPhraseEdited = true;
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
    this.nonVerifiedRegistrationService.submitRegistration(this.captchaResponse).subscribe({
      next: (response: RegistrationResult) => {
        this.needsAssessmentService.setNonVerifiedEvacuationFileNo(response);
        this.router.navigate(['/non-verified-registration/file-submission']);
      },
      error: (error: any) => {
        this.showLoader = !this.showLoader;
        this.isSubmitted = !this.isSubmitted;
        this.alertService.setAlert('danger', globalConst.submissionError);
      }
    });
  }

  submitVerified(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.alertService.clearAlert();
    this.evacuationFileDataService.updateRestriction().subscribe({
      next: (updated) => {
        if (updated !== null) {
          this.mapAndNavigate();
        }
      },
      error: (error: any) => {
        this.showLoader = !this.showLoader;
        this.isSubmitted = !this.isSubmitted;
        this.alertService.setAlert('danger', globalConst.submissionError);
      }
    });
  }

  mapAndNavigate() {
    let evacuationFileId: string;
    let eligibilityCheck: EligibilityCheck;

    this.evacuationFileDataService
      .createEvacuationFile()
      .pipe(
        tap((fileId) => {
          evacuationFileId = fileId;
          this.needsAssessmentService.setVerifiedEvacuationFileNo(evacuationFileId);
        }),
        switchMap(() => this.evacuationFileDataService.checkEligibleForSelfServeSupport({ evacuationFileId })),
        switchMap((check: EligibilityCheck) => {
          eligibilityCheck = check;
          if (eligibilityCheck?.isEligable) return this.supportsService.supportsGetDraftSupports({ evacuationFileId });
          else return of(null);
        })
      )
      .subscribe({
        next: (draftSupports: DraftSupports) => {
          if (eligibilityCheck?.isEligable && draftSupports?.items?.length > 0)
            this.router.navigate(['/verified-registration/eligible-self-serve/confirm']);
          else
            this.router.navigate(['/verified-registration/dashboard'], {
              state: {
                isNeedsAssessmentUpdatePendingOrExpiredEssFile:
                  !!this.essFileId() &&
                  [EvacuationFileStatus.Pending, EvacuationFileStatus.Expired].includes(
                    this.evacuationFileDataService.evacuationFileStatus
                  ),
                isNeedsAssessmentUpdateActiveEssFileForSupports:
                  !!this.essFileId() &&
                  [EvacuationFileStatus.Active].includes(this.evacuationFileDataService.evacuationFileStatus) &&
                  this.evacuationFileDataService.hasNoSupports(this.evacuationFileDataService.supports),
                isNeedsAssessmentUpdateActiveEssFileForSupportWithExtensions:
                  !!this.essFileId() &&
                  [EvacuationFileStatus.Active].includes(this.evacuationFileDataService.evacuationFileStatus) &&
                  this.evacuationFileDataService.supports?.length > 0 &&
                  !this.evacuationFileDataService.hasActiveSupports(this.evacuationFileDataService.supports)
              }
            });
        },
        error: (error: any) => {
          this.showLoader = !this.showLoader;
          this.isSubmitted = !this.isSubmitted;
          this.alertService.setAlert('danger', globalConst.submissionError);
        }
      });
  }

  allowSubmit($event: CaptchaResponse): void {
    this.captchaResponse = $event;
    if ($event.type === CaptchaResponseType.success) {
      this.captchaPassed = true;
    } else {
      this.captchaPassed = false;
    }
  }
}
