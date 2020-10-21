import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, AfterViewChecked {

  isEditable = true;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep = false;
  profileFolderPath = 'evacuee-profile-forms';
  @ViewChild('profileStepper') profileStepper: MatStepper;
  path: string;
  form$: Subscription;
  form: FormGroup;
  isComplete: boolean;
  stepToDisplay: number;

  constructor(private router: Router, private componentService: ComponentCreationService,
              private route: ActivatedRoute, private formCreationService: FormCreationService,
              public dataService: DataService, private cd: ChangeDetectorRef) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state !== undefined) {
      const state = navigation.extras.state as { stepIndex: number };
      this.stepToDisplay = state.stepIndex;
    }
  }

  ngOnInit(): void {
    this.steps = this.componentService.createProfileSteps();
    // console.log(this.router.getCurrentNavigation())
    // let navigation = this.router.getCurrentNavigation();
    // console.log(navigation);
    // if (navigation) {
    //   let state = navigation.extras.state as { stepIndex: number };
    //   this.stepToDisplay = state.stepIndex;
    // }
    // this.route.paramMap.subscribe(params => {
    //   console.log(params.get('stepPos'));
    //   if (params.get('stepPos') === 'last') {
    //     this.path = params.get('stepPos');
    //   }
    // });
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this.stepToDisplay === 3) {
      this.isComplete = true;
      setTimeout(() => {
        this.profileStepper.selectedIndex = this.stepToDisplay;
      }, 0);
    }
  }

  currentStep(index: number): void {
    this.loadStepForm(index);
  }

  createProfile(lastStep: boolean): void {
    if (lastStep) {
      this.showStep = !this.showStep;
      // this.router.navigate(['/create-evac-file']);
      // this.steps = this.componentService.createEvacSteps();
    }
  }

  goBack(stepper: MatStepper, lastStep): void {
    if (lastStep === 0) {
      stepper.previous();
    } else if (lastStep === -1) {
      this.showStep = !this.showStep;
      // stepper.selectedIndex
      // this.profileStepper.changes.subscribe(x=> {
      //   console.log(x)
      //   x.first._selectedIndex = 3
      // console.log(this.steps.length)
      // })

    } else if (lastStep === -2) {
      this.router.navigate(['/non-verified-registration/restriction']);
    }
  }

  goForward(stepper: MatStepper, isLast: boolean, component: string): void {
    if (this.form.status === 'VALID') {
      if (isLast) {
        this.router.navigate(['/non-verified-registration/needs-assessment']);
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
      case 'personal-details':
        this.formCreationService.setPersonDetailsForm(this.form);
        this.dataService.updateRegistartion({ personalDetails: this.form.value });
        this.isComplete = false;
        break;
      case 'address':
        this.formCreationService.setAddressForm(this.form);
        this.dataService.updateRegistartion({ mailingAddress: this.form.get('mailingAddress').value });
        this.dataService.updateRegistartion({ primaryAddress: this.form.get('address').value });
        this.isComplete = false;
        break;
      case 'contact-info':
        this.formCreationService.setContactDetailsForm(this.form);
        this.dataService.updateRegistartion({ contactDetails: this.form.value });
        this.isComplete = false;
        break;
      case 'secret':
        this.formCreationService.setSecretForm(this.form);
        this.dataService.updateRegistartion(this.form.value);
        this.isComplete = false;
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

}

