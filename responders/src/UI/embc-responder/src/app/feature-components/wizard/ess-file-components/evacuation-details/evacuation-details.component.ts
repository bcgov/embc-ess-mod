import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import * as globalConst from '../../../../core/services/global-constants';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';
import { Subscription } from 'rxjs';
import { AddressModel } from 'src/app/core/models/address.model';
import { CommunityType } from '../../../../core/api/models';

@Component({
  selector: 'app-evacuation-details',
  templateUrl: './evacuation-details.component.html',
  styleUrls: ['./evacuation-details.component.scss']
})
export class EvacuationDetailsComponent implements OnInit, OnDestroy {
  evacDetailsForm: FormGroup;
  insuranceOption = globalConst.insuranceOptions;
  radioOption = globalConst.radioButtonOptions1;
  referredServicesOption = globalConst.referredServiceOptions;
  defaultCountry = globalConst.defaultCountry;
  defaultProvince = globalConst.defaultProvince;
  showReferredServicesForm = false;
  showBCAddressForm = false;
  isBCAddress = true;
  selection = new SelectionModel<any>(true, []);
  tabUpdateSubscription: Subscription;

  bCDummyAddress: AddressModel = {
    addressLine1: 'Unit 1200',
    addressLine2: '1230 Main Street',
    community: {
      code: '6e69dfaf-9f97-ea11-b813-005056830319',
      countryCode: 'CAN',
      districtName: 'Cariboo',
      name: '100 Mile House',
      stateProvinceCode: 'BC',
      type: CommunityType.DistrictMunicipality
    },
    stateProvince: { code: 'BC', countryCode: 'CAN', name: 'British Columbia' },
    postalCode: 'V8Y 6U8',
    country: { code: 'CAN', name: 'Canada' }
  };
  nonBcDummyAddress: AddressModel = {
    addressLine1: 'Unit 2300',
    addressLine2: '1230 Oak Street',
    community: undefined,
    stateProvince: { code: 'FL', countryCode: 'USA', name: 'Florida' },
    postalCode: '33009',
    country: { code: 'USA', name: 'United States of America' }
  };

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.createEvacDetailsForm();
    this.checkPrimaryAddress();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );

    // Update Value and Validity for referredServiceDetails if referredServices changes
    this.evacDetailsForm
      .get('referredServices')
      .valueChanges.subscribe((value) => {
        this.evacDetailsForm
          .get('referredServiceDetails')
          .updateValueAndValidity();
      });

    // Display the referredServiceDetails in case referred Service is set as true
    if (this.stepCreateEssFileService.referredServiceS === true) {
      this.showReferredServicesForm = true;

      for (const option of this.stepCreateEssFileService
        .referredServiceDetailS) {
        this.selection.toggle(option);
      }
    }

    // Display the Evacuation Address form if the answer is set as false
    if (this.stepCreateEssFileService.evacuatedFromPrimaryAddress === false) {
      this.showBCAddressForm = true;
    }
  }

  /**
   * Listens to changes on evacuation Address options
   *
   * @param event
   */
  evacPrimaryAddressChange(event: MatRadioChange): void {
    if (event.value === true) {
      this.showBCAddressForm = false;
      this.evacDetailsForm.get('evacAddress').setValue(this.bCDummyAddress);
    } else {
      this.showBCAddressForm = true;
      this.evacDetailsForm.get('evacAddress').reset();
    }
  }

  /**
   * Listens to changes on the Referred Services option
   *
   * @param event
   */
  referredServiceChange(event: MatRadioChange): void {
    if (event.value === true) {
      this.showReferredServicesForm = true;
    } else {
      this.showReferredServicesForm = false;
      this.selection.clear();
      this.evacDetailsForm
        .get('referredServiceDetails')
        .setValue(this.selection.selected);
    }

    // this.evacDetailsForm.get('referredServiceDetails').updateValueAndValidity();
  }

  /**
   * Controls the selection of referred services
   *
   * @param option Referred Services
   */
  selectionToggle(option): void {
    this.selection.toggle(option);

    this.evacDetailsForm
      .get('referredServiceDetails')
      .setValue(this.selection.selected);
  }

  /**
   * Returns the control of the form
   */
  get evacDetailsFormControl(): { [key: string]: AbstractControl } {
    return this.evacDetailsForm.controls;
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
    this.router.navigate(['/ess-wizard/create-ess-file/household-members']);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    console.log(this.evacDetailsForm);
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  private createEvacDetailsForm(): void {
    if (!this.stepCreateEssFileService.referredServiceDetailS)
      this.stepCreateEssFileService.referredServiceDetailS = [];

    this.evacDetailsForm = this.formBuilder.group({
      paperESSFile: [
        this.stepCreateEssFileService.paperESSFiles !== undefined
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
        this.stepCreateEssFileService.facilityNames !== undefined
          ? this.stepCreateEssFileService.facilityNames
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      insurance: [
        this.stepCreateEssFileService.insuranceInfo !== undefined
          ? this.stepCreateEssFileService.insuranceInfo
          : '',
        Validators.required
      ],
      householdAffected: [
        this.stepCreateEssFileService.householdAffectedInfo !== undefined
          ? this.stepCreateEssFileService.householdAffectedInfo
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      emergencySupportServices: [
        this.stepCreateEssFileService.emergencySupportServiceS !== undefined
          ? this.stepCreateEssFileService.emergencySupportServiceS
          : ''
      ],
      referredServices: [
        this.stepCreateEssFileService.referredServiceS !== undefined
          ? this.stepCreateEssFileService.referredServiceS
          : ''
      ],
      referredServiceDetails: [
        this.stepCreateEssFileService.referredServiceDetailS,
        [
          this.customValidation
            .conditionalValidation(
              () => this.evacDetailsForm.get('referredServices').value === true,
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ],
      externalServices: [
        this.stepCreateEssFileService.externalServiceS !== undefined
          ? this.stepCreateEssFileService.externalServiceS
          : ''
      ],
      evacAddress: this.createEvacAddressForm()
    });
  }

  /**
   * Creates the primary address form
   *
   * @returns form group
   */
  private createEvacAddressForm(): FormGroup {
    return this.formBuilder.group({
      addressLine1: [
        this.stepCreateEssFileService?.evacAddresS?.addressLine1 !== undefined
          ? this.stepCreateEssFileService.evacAddresS.addressLine1
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      addressLine2: [
        this.stepCreateEssFileService?.evacAddresS?.addressLine2 !== undefined
          ? this.stepCreateEssFileService.evacAddresS.addressLine2
          : ''
      ],
      community: [
        this.stepCreateEssFileService?.evacAddresS?.community !== undefined
          ? this.stepCreateEssFileService.evacAddresS.community
          : '',
        [Validators.required]
      ],
      stateProvince: [
        this.stepCreateEssFileService?.evacAddresS?.stateProvince !== undefined
          ? this.stepCreateEssFileService.evacAddresS.stateProvince
          : '',
        [Validators.required]
      ],
      country: [
        this.stepCreateEssFileService?.evacAddresS?.country !== undefined
          ? this.stepCreateEssFileService.evacAddresS.country
          : '',
        [Validators.required]
      ],
      postalCode: [
        this.stepCreateEssFileService?.evacAddresS?.postalCode !== undefined
          ? this.stepCreateEssFileService.evacAddresS.postalCode
          : '',
        [this.customValidation.postalValidation().bind(this.customValidation)]
      ]
    });
  }

  /**
   * Checks if the inserted primary address is in BC Province
   */
  private checkPrimaryAddress() {
    if (this.bCDummyAddress.stateProvince.code !== 'BC') {
      this.evacDetailsForm.get('evacuatedFromPrimary').setValue('No');
      this.isBCAddress = false;
    }
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
  private updateTabStatus() {
    if (this.evacDetailsForm.valid) {
      this.stepCreateEssFileService.setTabStatus(
        'evacuation-details',
        'complete'
      );
    } else if (
      this.stepCreateEssFileService.checkForPartialUpdates(this.evacDetailsForm)
    ) {
      this.stepCreateEssFileService.setTabStatus(
        'evacuation-details',
        'incomplete'
      );
    } else {
      this.stepCreateEssFileService.setTabStatus(
        'evacuation-details',
        'not-started'
      );
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepCreateEssFileService.paperESSFiles = this.evacDetailsForm.get(
      'paperESSFile'
    ).value;
    this.stepCreateEssFileService.evacuatedFromPrimaryAddress = this.evacDetailsForm.get(
      'evacuatedFromPrimary'
    ).value;
    this.stepCreateEssFileService.evacAddresS = this.evacDetailsForm.get(
      'evacAddress'
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
