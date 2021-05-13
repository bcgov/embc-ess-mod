import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
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
  showReferredServicesForm = false;
  showBCAddressForm = false;

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.createEvacDetailsForm();
  }

  createEvacDetailsForm(): void {
    this.evacDetailsForm = this.formBuilder.group({
      paperESSFile: [
        this.stepCreateEssFileService.paperESSFiles !== null
          ? this.stepCreateEssFileService.paperESSFiles
          : ''
      ],
      evacuatedFromPrimary: [
        this.stepCreateEssFileService.evacuatedFromPrimaryAddress !== null
          ? this.stepCreateEssFileService.evacuatedFromPrimaryAddress
          : '',
        Validators.required
      ],
      facilityName: [
        this.stepCreateEssFileService.facilityNames !== null
          ? this.stepCreateEssFileService.facilityNames
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      insurance: [
        this.stepCreateEssFileService.insuranceInfo !== null
          ? this.stepCreateEssFileService.insuranceInfo
          : '',
        Validators.required
      ],
      householdAffected: [
        this.stepCreateEssFileService.householdAffectedInfo !== null
          ? this.stepCreateEssFileService.householdAffectedInfo
          : ''
      ],
      emergencySupportServices: [
        this.stepCreateEssFileService.emergencySupportServiceS !== null
          ? this.stepCreateEssFileService.emergencySupportServiceS
          : ''
      ],
      referredServices: [
        this.stepCreateEssFileService.referredServiceS !== null
          ? this.stepCreateEssFileService.referredServiceS
          : ''
      ],
      referredServiceDetails: [
        this.stepCreateEssFileService.referredServiceDetailS.length !== 0
          ? this.stepCreateEssFileService.referredServiceDetailS
          : new FormArray([])
      ],
      externalServices: [
        this.stepCreateEssFileService.externalServiceS !== null
          ? this.stepCreateEssFileService.externalServiceS
          : ''
      ]
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
    const formArray: FormArray = this.evacDetailsForm.get(
      'referredServiceDetails'
    ) as FormArray;

    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      let i = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.source.value) {
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
