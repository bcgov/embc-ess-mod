import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCreationService } from '../../../core/services/componentCreation.service';
import { ComponentMetaDataModel } from '../../../core/model/componentMetaData.model';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../../core/services/formCreation.service';
import { DataUpdationService } from '../../../core/services/dataUpdation.service';
import { DataSubmissionService } from 'src/app/core/services/dataSubmission.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  isEditable = true;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep = false;
  profileFolderPath = 'evacuee-profile-forms';
  @ViewChild('profileStepper') profileStepper: MatStepper;
  path: string;
  form$: Subscription;
  form: FormGroup;
  stepToDisplay: number;
  currentFlow: string;
  type = 'profile';
  profileHeading: string;
  parentPageName = 'create-profile';
  showLoader = false;

  constructor(
    private router: Router, private componentService: ComponentCreationService, private route: ActivatedRoute,
    private formCreationService: FormCreationService, public updateService: DataUpdationService, private cd: ChangeDetectorRef,
    private submissionService: DataSubmissionService, private alertService: AlertService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state !== undefined) {
      const state = navigation.extras.state as { stepIndex: number };
      this.stepToDisplay = state.stepIndex;
    }
  }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    if (this.currentFlow === 'non-verified-registration') {
      this.profileHeading = 'Create Profile';
    } else {
      this.profileHeading = 'Create Your ERA Profile';
    }
    this.steps = this.componentService.createProfileSteps();
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this.stepToDisplay === 3) {
      setTimeout(() => {
        this.profileStepper.selectedIndex = this.stepToDisplay;
      }, 0);
    }
    if (this.stepToDisplay === 4) {
      setTimeout(() => {
        this.profileStepper.selectedIndex = this.stepToDisplay;
      }, 0);
    }
  }

  currentStep(index: number): void {
    this.loadStepForm(index);
    this.cd.detectChanges();
  }

  stepChanged(event: any, stepper: MatStepper): void {
    stepper.selected.interacted = false;
  }

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

  goForward(stepper: MatStepper, isLast: boolean, component: string): void {
    if (isLast && component === 'review') {
      console.log('profile-submit');
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

  setFormData(component: string): void {
    switch (component) {
      case 'personal-details':
        this.updateService.updatePersonalDetails(this.form);
        break;
      case 'address':
        this.updateService.updateAddressDetails(this.form);
        break;
      case 'contact-info':
        this.updateService.updateContactDetails(this.form);
        break;
      case 'secret':
        this.updateService.updateSecretDetails(this.form);
        break;
      default:
    }
  }

  /**
   * Loads appropriate forms based on the current step
   * @param index Step index
   */
  loadStepForm(index: number): void {
    switch (index) {
      case 0:
        this.form$ = this.formCreationService.getPeronalDetailsForm().subscribe(
          personalDetails => {
            this.form = personalDetails;
          }
        );
        break;
      case 1:
        this.form$ = this.formCreationService.getAddressForm().subscribe(
          address => {
            this.form = address;
          }
        );
        break;
      case 2:
        this.form$ = this.formCreationService.getContactDetailsForm().subscribe(
          contactDetails => {
            this.form = contactDetails;
          }
        );
        break;
      case 3:
        this.form$ = this.formCreationService.getSecretForm().subscribe(
          secret => {
            this.form = secret;
          }
        );
        break;
    }
  }

  submitFile(): void {
    this.showLoader = !this.showLoader;
    this.alertService.clearAlert();
    // this.router.navigate(['/verified-registration/view-profile']);
    this.submissionService.submitProfile().subscribe((response) => {
      console.log(typeof response);
      console.log(response);
      // this.updateService.updateRegisrationResult(response);
      window.sessionStorage.setItem('userid', JSON.stringify(response));
      this.router.navigate(['/verified-registration/view-profile']);
    }, (error) => {
      console.log(error);
      this.showLoader = !this.showLoader;
      this.alertService.setAlert('danger', error.title);
    });

  }

  ngOnDestroy(): void {
    this.form$.unsubscribe();
  }

}

