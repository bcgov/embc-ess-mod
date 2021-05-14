import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import * as globalConst from '../../../../core/services/global-constants';
import { AddressService } from '../../profile-components/address/address.service';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';
import {
  Address
} from 'src/app/core/models/profile';

@Component({
  selector: 'app-evacuation-details',
  templateUrl: './evacuation-details.component.html',
  styleUrls: ['./evacuation-details.component.scss']
})
export class EvacuationDetailsComponent implements OnInit {
  evacDetailsForm: FormGroup;
  insuranceOption = globalConst.insuranceOptions;
  radioOption: string[] = ['Yes', 'No'];
  referredServicesOption = globalConst.referredServiceOptions;
  defaultCountry = globalConst.defaultCountry;
  defaultProvince = globalConst.defaultProvince;
  showReferredServicesForm = false;
  showBCAddressForm = false;
  selection = new SelectionModel<any>(true, []);

  dummyAddress: Address = {addressLine1: 'Unit 1200', addressLine2: '1230 Main Street', jurisdiction: 'North Vancouver', stateProvince: 'British Columbia', postalCode: 'V8Y 6U8', country: 'Canada'};

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private addressService: AddressService,
    private cd: ChangeDetectorRef,
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
          : new FormArray([]), [this.customValidation.referredServicesValidator()
          .bind(this.customValidation)]
      ],
      externalServices: [
        this.stepCreateEssFileService.externalServiceS !== null
          ? this.stepCreateEssFileService.externalServiceS
          : ''
      ],
      evacAddress: this.createEvacAddressForm()
    });
  }

  evacPrimaryAddressChange(event: MatRadioChange): void {
    if (event.value === 'Yes') {
      this.showBCAddressForm = false;
      this.evacDetailsForm.get('evacAddress').setValue(this.dummyAddress);
    } else {
      this.showBCAddressForm = true;

      this.evacDetailsForm.get('evacAddress').reset();
      this.evacDetailsForm.get('evacAddress.stateProvince').setValue(globalConst.defaultProvince);
      this.evacDetailsForm.get('evacAddress.country').setValue(globalConst.defaultCountry);
      // console.log(this.evacuatedForm.get('evacuatedFromAddress'));
    }
  }

  /**
   * Listens to changes on the Referred Services option
   * @param event 
   */
  referredServiceChange(event: MatRadioChange): void {
    if (event.value === 'Yes') {
      this.showReferredServicesForm = true;
    } else {
      this.showReferredServicesForm = false;
    }
  }

  /**
   * Controls the selection of referred services
   *
   * @param option Referred Services
   */
  selectionToggle(option): void {
    this.selection.toggle(option);
  }

  /**
   * Returns the control of the evacuated address form
   */
   public get evacAddressFormGroup(): FormGroup {
    return this.evacDetailsForm.get('evacAddress') as FormGroup;
  }

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    console.log(this.evacDetailsForm.status);
    this.updateTabStatus();
    // this.router.navigate(['/ess-wizard//ess-wizard/create-ess-file/animals']);
  }

   /**
   * Creates the primary address form
   *
   * @returns form group
   */
    private createEvacAddressForm(): FormGroup {
      return this.formBuilder.group({
        addressLine1: [
          this.stepCreateEssFileService?.evacAddresS?.addressLine1 !==
          undefined
            ? this.stepCreateEssFileService.evacAddresS.addressLine1
            : '',
          [this.customValidation.whitespaceValidator()]
        ],
        addressLine2: [
          this.stepCreateEssFileService?.evacAddresS?.addressLine2 !==
          undefined
            ? this.stepCreateEssFileService.evacAddresS.addressLine2
            : ''
        ],
        jurisdiction: [
          this.stepCreateEssFileService?.evacAddresS?.jurisdiction !==
          undefined
            ? this.stepCreateEssFileService.evacAddresS.jurisdiction
            : '',
          [Validators.required]
        ],
        stateProvince: [{ value: 
          this.stepCreateEssFileService?.evacAddresS?.stateProvince !==
          undefined
            ? this.stepCreateEssFileService.evacAddresS.stateProvince
            : this.defaultProvince, disabled: true }],
        country: [{ value: this.stepCreateEssFileService?.evacAddresS?.country !==
          undefined
            ? this.stepCreateEssFileService.evacAddresS.country
            : this.defaultCountry, disabled: true }],
        postalCode: [
          this.stepCreateEssFileService?.evacAddresS?.postalCode !==
          undefined
            ? this.stepCreateEssFileService.evacAddresS.postalCode
            : '',
          [this.customValidation.postalValidation().bind(this.customValidation)]
        ]
      });
    }

    /**
   * Updates the value and validity of the forms
   */
  private updateOnVisibility(): void {
    this.evacDetailsForm = this.addressService.updateOnVisibility(
      this.evacDetailsForm
    );
    this.cd.detectChanges();
  }

  private updateTabStatus() {
    if (this.evacDetailsForm.valid) {
      this.stepCreateEssFileService.setTabStatus('evacuation-details', 'complete');
    } else if (this.evacDetailsForm.touched) {
      this.stepCreateEssFileService.setTabStatus('evacuation-details', 'incomplete');
    } else {
      this.stepCreateEssFileService.setTabStatus('evacuation-details', 'not-started');
    }
    this.saveFormData();
  }

  saveFormData() {
    this.stepCreateEssFileService.paperESSFiles = this.evacDetailsForm.get(
      'paperESSFile'
    ).value;
    this.stepCreateEssFileService.evacuatedFromPrimaryAddress = this.evacDetailsForm.get(
      'evacuatedFromPrimary'
    ).value;
    this.stepCreateEssFileService.evacAddresS = this.evacDetailsForm.get(
      'facilityName'
    ).value;
    this.stepCreateEssFileService.facilityNames = this.evacDetailsForm.get(
      'facilityName'
    ).value;
    this.stepCreateEssFileService.insuranceInfo = this.evacDetailsForm.get(
      'insurance'
    ).value;
    this.stepCreateEssFileService.householdAffectedInfo = this.evacDetailsForm.get(
      'householdAffected'
    ).value;
    this.stepCreateEssFileService.emergencySupportServiceS = this.evacDetailsForm.get(
      'emergencySupportServices'
    ).value;
    this.stepCreateEssFileService.referredServiceS = this.evacDetailsForm.get(
      'referredServices'
    ).value;
    this.stepCreateEssFileService.referredServiceDetailS = this.selection.selected;
    this.stepCreateEssFileService.externalServiceS = this.evacDetailsForm.get(
      'externalServices'
    ).value;
  }
}
