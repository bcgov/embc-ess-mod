import { Component, OnInit, Type, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCreationService } from '../core/services/componentCreation.service';
import { ComponentMetaDataModel } from '../core/model/componentMetaData.model';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../core/services/formCreation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  isEditable = true;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep = false;
  profileFolderPath = 'evacuee-profile-forms';
  @ViewChild('profileStepper') profileStepper: MatStepper;
  path: string;
  form$: Subscription;
  form: FormGroup;
  isComplete: boolean;

  constructor(private router: Router, private componentService: ComponentCreationService,
              private route: ActivatedRoute, private formCreationService: FormCreationService) { }

  ngOnInit(): void {
    this.steps = this.componentService.createProfileSteps();
    // this.route.paramMap.subscribe(params => {
    //   console.log(params.get('stepPos'));
    //   if (params.get('stepPos') === 'last') {
    //     this.path = params.get('stepPos');
    //   }
    // });
  }

  ngAfterViewInit(): void {
    // if (this.path === 'last') {
    //   console.log('heeeeeeeeeeeere');
    //   console.log(this.profileStepper);
    //   // this.profileStepper.selectedIndex = 2;
    //   setTimeout(() => {
    //     console.log(this.steps.length - 1);
    //     this.profileStepper.selectedIndex = 3;
    //   }, 0);
    // }
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
      console.log(this.profileStepper);
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
        this.isComplete = false;
        break;
      case 'address':
        this.formCreationService.setAddressForm(this.form);
        this.isComplete = false;
        break;
      case 'contact-info':
        this.formCreationService.setContactDetailsForm(this.form);
        this.isComplete = false;
        break;
      case 'secret':
        this.formCreationService.setSecretForm(this.form);
        this.isComplete = false;
        break;
      default:
    }
    // if (component === 'personal-details') {
    //   this.formCreationService.setPersonDetailsForm(this.form);
    // }
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




// firstFormGroup: FormGroup;
  // profileComponents$: Observable<any>;
  // profileComponents1: ComponentMetaDataModel;
    // this.profileComponents$ = this.componentService.getProfileComponents().pipe(mergeMap((components) => {
    //   return Promise.all(components.map(comp => {
    //     console.log((`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`));
    //     return import(`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`);
    //   }))
    // }));

    // this.profileComponents$.subscribe(x => {
    //   console.log(x)
    // })


    // this.profileComponents1 = this.componentService.getProfileComponents1().pipe(mergeMap((components) => {
    //   return Promise.all(components.map((comp) => {
    //     console.log((`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`));
    //      import(`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`);
    //   }))
    // }));

