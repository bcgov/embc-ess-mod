import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProfileDataService } from './profile-data.service';
import { ProfileService } from './profile.service';
import * as globalConst from '../../core/services/globalConstants';
import { SecurityQuestion } from 'src/app/core/api/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @ViewChild('profileStepper') profileStepper: MatStepper;
  isEditable = true;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep = false;
  profileFolderPath = 'evacuee-profile-forms';
  path: string;
  form$: Subscription;
  form: UntypedFormGroup;
  stepToDisplay: number;
  currentFlow: string;
  type = 'profile';
  profileHeading: string;
  parentPageName = 'create-profile';
  showLoader = false;
  isSubmitted = false;

  constructor(
    private router: Router,
    private componentService: ComponentCreationService,
    private route: ActivatedRoute,
    private formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    private alertService: AlertService,
    private profileDataService: ProfileDataService,
    private profileService: ProfileService
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
    this.profileHeading = 'Create Your Profile';
    this.steps = this.componentService.createProfileSteps();
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this.stepToDisplay === 3) {
      this.profileStepper.linear = false;
      setTimeout(() => {
        this.profileStepper.selectedIndex = this.stepToDisplay;
        this.profileStepper.linear = true;
      }, 0);
    }
    if (this.stepToDisplay === 4) {
      this.profileStepper.linear = false;
      setTimeout(() => {
        this.profileStepper.selectedIndex = this.stepToDisplay;
        this.profileStepper.linear = true;
      }, 0);
    }
  }

  /**
   * Loads form for every step based on index
   *
   * @param index step index
   */
  currentStep(index: number): void {
    this.loadStepForm(index);
    this.cd.detectChanges();
  }

  /**
   * Triggered on the step change animation event
   *
   * @param event animation event
   * @param stepper stepper instance
   */
  stepChanged(event: any, stepper: MatStepper): void {
    stepper.selected.interacted = false;
  }

  /**
   * Custom back stepper function
   *
   * @param stepper stepper instance
   * @param lastStep stepIndex
   */
  goBack(stepper: MatStepper, lastStep): void {
    if (lastStep === 0) {
      stepper.previous();
    } else if (lastStep === -1) {
      this.showStep = !this.showStep;
    } else if (lastStep === -2) {
      const navigationPath = '/' + this.currentFlow + '/restriction';
      this.router.navigate([navigationPath]);
    }
  }

  /**
   * Custom next stepper function
   *
   * @param stepper stepper instance
   * @param isLast stepperIndex
   * @param component current component name
   */
  goForward(stepper: MatStepper, isLast: boolean, component: string): void {
    if (isLast && component === 'review') {
      this.submitFile();
    } else if (this.form.status === 'VALID') {
      if (isLast) {
        if (this.currentFlow === 'non-verified-registration') {
          const navigationPath = '/' + this.currentFlow + '/needs-assessment';
          this.router.navigate([navigationPath]);
        }
      }
      this.setFormData(component);
      this.form$.unsubscribe();
      stepper.selected.completed = true;
      stepper.next();
    } else {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Sets the form data to the DTO services
   *
   * @param component Name of the component
   */
  setFormData(component: string): void {
    switch (component) {
      case 'personal-details':
        this.profileDataService.personalDetails = this.form.value;
        break;
      case 'address':
        this.profileDataService.primaryAddressDetails =
          this.form.get('address').value;
        this.profileDataService.mailingAddressDetails =
          this.form.get('mailingAddress').value;
        break;
      case 'contact-info':
        this.profileDataService.contactDetails = this.form.value;
        break;
      case 'security-questions':
        this.saveSecurityQuestions(
          this.form.get('questions') as UntypedFormGroup
        );
        break;
      default:
    }
  }

  /**
   * Loads appropriate forms based on the current step
   *
   * @param index Step index
   */
  loadStepForm(index: number): void {
    switch (index) {
      case 0:
        this.form$ = this.formCreationService
          .getPersonalDetailsForm()
          .subscribe((personalDetails) => {
            this.form = personalDetails;
          });
        break;
      case 1:
        this.form$ = this.formCreationService
          .getAddressForm()
          .subscribe((address) => {
            this.form = address;
          });
        break;
      case 2:
        this.form$ = this.formCreationService
          .getContactDetailsForm()
          .subscribe((contactDetails) => {
            this.form = contactDetails;
          });
        break;
      case 3:
        this.form$ = this.formCreationService
          .getSecurityQuestionsForm()
          .subscribe((securityQues) => {
            this.form = securityQues;
          });
        break;
    }
  }

  submitFile(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.alertService.clearAlert();
    this.profileService
      .upsertProfile(this.profileDataService.createProfileDTO())
      .subscribe({
        next: (profileId) => {
          this.profileDataService.setProfileId(profileId);
          this.router.navigate(['/verified-registration/dashboard']);
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.isSubmitted = !this.isSubmitted;
          this.alertService.setAlert('danger', globalConst.saveProfileError);
        }
      });
  }

  private saveSecurityQuestions(questionForm: UntypedFormGroup) {
    //let anyValueSet = false;
    const securityQuestions: Array<SecurityQuestion> = [];

    // Create SecurityQuestion objects and save to array, and check if any value set
    for (let i = 1; i <= 3; i++) {
      const question = questionForm.get(`question${i}`).value?.trim() ?? '';
      const answer = questionForm.get(`answer${i}`).value?.trim() ?? '';

      // if (question.length > 0 || answer.length > 0) {
      //   anyValueSet = true;
      // }

      securityQuestions.push({
        id: i,
        answerChanged: true,
        question,
        answer
      });
    }
    this.profileDataService.securityQuestions = securityQuestions;
  }
}
