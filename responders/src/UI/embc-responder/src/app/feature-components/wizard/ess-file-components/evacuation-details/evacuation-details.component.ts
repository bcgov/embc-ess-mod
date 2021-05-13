import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import * as globalConst from '../../../../core/services/global-constants';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';

@Component({
  selector: 'app-evacuation-details',
  templateUrl: './evacuation-details.component.html',
  styleUrls: ['./evacuation-details.component.scss']
})
export class EvacuationDetailsComponent implements OnInit {

  evacDetailsForm: FormGroup;
  insuranceOption = globalConst.insuranceOptions;
  referredServicesOption = globalConst.referredServiceOptions;
  showReferredServicesForm: boolean = false;
  showBCAddressForm: boolean = false;

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
  ) {}

  ngOnInit(): void {
    this.createEvacDetailsForm();
  }

  createEvacDetailsForm(): void {
    this.evacDetailsForm = this.formBuilder.group({
      paperESSFile: [''],
      evacuatedFromPrimary: ['', Validators.required],
      facilityName: ['', [this.customValidation.whitespaceValidator()]],
      insurance: ['', Validators.required],
      householdAffected: [''],
      emergencySupportServices: [''],
      referredServices: [''],
      referredServiceDetails: new FormArray([]),
      servicesOutside: ['']
    });
  }

  evacPrimaryAddressChange(event: MatRadioChange): void {

    if (event.value === 'Yes') {
      this.showBCAddressForm = false;

      // this.evacuatedForm.get('evacuatedFromAddress').setValue(this.primaryAddressForm.get('address').value);

    } else {
      this.showBCAddressForm = true;

      // this.evacuatedForm.get('evacuatedFromAddress').reset();
      // this.evacuatedForm.get('evacuatedFromAddress.stateProvince').setValue(globalConst.defaultProvince);
      // this.evacuatedForm.get('evacuatedFromAddress.country').setValue(globalConst.defaultCountry);
      // console.log(this.evacuatedForm.get('evacuatedFromAddress'));
    }
  }

  referredServiceChange(event: MatRadioChange): void {
    if (event.value === 'Yes') {
      this.showReferredServicesForm = true;
    } else {
      this.showReferredServicesForm = false;
    }
  }

  referredServiceDetailsChange(event: MatCheckboxChange): void {
    const formArray: FormArray = this.evacDetailsForm.get('referredServiceDetails') as FormArray;

    if(event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {

        if(ctrl.value == event.source.value) {
          formArray.removeAt(i);
          return;
        }
  
        i++;
      });
    }
  }

  /**
   * Updates the tab status and navigate to next tab
   */
   next(): void {
    // this.stepCreateProfileService.setTabStatus('collection-notice', 'complete');
    // this.router.navigate(['/ess-wizard/create-evacuee-profile/restriction']);
  }

}
