import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import { Subscription } from 'rxjs';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';

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
  showInsuranceMsg = false;
  wizardType: string;

  selection = new SelectionModel<any>(true, []);
  tabUpdateSubscription: Subscription;

  constructor(
    public stepEssFileService: StepEssFileService,
    private evacueeSessionService: EvacueeSessionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.wizardType = this.evacueeSessionService.getWizardType();

    this.createEvacDetailsForm();
    this.checkAddress();

    // Evacuation Province/Country must always be system defaults
    this.evacDetailsForm
      .get('evacAddress.stateProvince')
      .setValue(globalConst.defaultProvince);

    this.evacDetailsForm
      .get('evacAddress.country')
      .setValue(globalConst.defaultCountry);

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepEssFileService.nextTabUpdate.subscribe(
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
    if (this.stepEssFileService.referredServices === true) {
      this.showReferredServicesForm = true;

      for (const option of this.stepEssFileService.referredServiceDetails) {
        this.selection.toggle(option);
      }
    }

    // Display the Evacuation Address form if the answer is set as false
    if (this.stepEssFileService.evacuatedFromPrimary === false) {
      this.showBCAddressForm = true;
    }
  }

  /**
   * Listens to changes on Insurance options
   *
   * @param event
   */
  insuranceChange(event: MatRadioChange): void {
    const showVals = ['Yes', 'Unsure'];

    this.showInsuranceMsg = showVals.includes(event.value);
  }

  /**
   * Listens to changes on evacuation Address options
   *
   * @param event
   */
  evacPrimaryAddressChange(event: MatRadioChange): void {
    if (event.value === true) {
      this.showBCAddressForm = false;
      this.evacDetailsForm
        .get('evacAddress')
        .setValue(this.stepEssFileService.primaryAddress);
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
    this.router.navigate(['/ess-wizard/ess-file/household-members']);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  private createEvacDetailsForm(): void {
    if (!this.stepEssFileService.referredServiceDetails)
      this.stepEssFileService.referredServiceDetails = [];

    this.evacDetailsForm = this.formBuilder.group({
      paperESSFile: [
        this.stepEssFileService.paperESSFile !== undefined
          ? this.stepEssFileService.paperESSFile
          : ''
      ],
      evacuatedFromPrimary: [
        this.stepEssFileService.evacuatedFromPrimary !== null
          ? this.stepEssFileService.evacuatedFromPrimary
          : '',
        Validators.required
      ],
      facilityName: [
        this.stepEssFileService.facilityName !== undefined
          ? this.stepEssFileService.facilityName
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      insurance: [
        this.stepEssFileService.insurance !== undefined
          ? this.stepEssFileService.insurance
          : '',
        Validators.required
      ],
      householdAffected: [
        this.stepEssFileService.evacuationImpact !== undefined
          ? this.stepEssFileService.evacuationImpact
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      emergencySupportServices: [
        this.stepEssFileService.householdRecoveryPlan !== undefined
          ? this.stepEssFileService.householdRecoveryPlan
          : ''
      ],
      referredServices: [
        this.stepEssFileService.referredServices !== undefined
          ? this.stepEssFileService.referredServices
          : ''
      ],
      referredServiceDetails: [
        this.stepEssFileService.referredServiceDetails,
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
        this.stepEssFileService.evacuationExternalReferrals !== undefined
          ? this.stepEssFileService.evacuationExternalReferrals
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
        this.stepEssFileService?.evacAddress?.addressLine1 !== undefined
          ? this.stepEssFileService.evacAddress.addressLine1
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      addressLine2: [
        this.stepEssFileService?.evacAddress?.addressLine2 !== undefined
          ? this.stepEssFileService.evacAddress.addressLine2
          : ''
      ],
      community: [
        this.stepEssFileService?.evacAddress?.community !== undefined
          ? this.stepEssFileService.evacAddress.community
          : '',
        [Validators.required]
      ],
      stateProvince: [
        this.stepEssFileService?.evacAddress?.stateProvince !== undefined
          ? this.stepEssFileService.evacAddress.stateProvince
          : '',
        [Validators.required]
      ],
      country: [
        this.stepEssFileService?.evacAddress?.country !== undefined
          ? this.stepEssFileService.evacAddress.country
          : '',
        [Validators.required]
      ],
      postalCode: [
        this.stepEssFileService?.evacAddress?.postalCode !== undefined
          ? this.stepEssFileService.evacAddress.postalCode
          : '',
        [this.customValidation.postalValidation().bind(this.customValidation)]
      ]
    });
  }

  /**
   * Checks if the inserted primary address is in BC Province
   */
  private checkAddress() {
    if (this.stepEssFileService?.primaryAddress?.stateProvince?.code !== 'BC') {
      this.evacDetailsForm.get('evacuatedFromPrimary').setValue('No');
      this.isBCAddress = false;
    }
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
  private updateTabStatus() {
    if (this.evacDetailsForm.valid) {
      this.stepEssFileService.setTabStatus('evacuation-details', 'complete');
    } else if (
      this.stepEssFileService.checkForPartialUpdates(this.evacDetailsForm)
    ) {
      this.stepEssFileService.setTabStatus('evacuation-details', 'incomplete');
    } else {
      this.stepEssFileService.setTabStatus('evacuation-details', 'not-started');
    }
    this.saveFormData();
  }

  /**
   * Saves information inserted inthe form into the service
   */
  private saveFormData() {
    this.stepEssFileService.paperESSFile = this.evacDetailsForm.get(
      'paperESSFile'
    ).value;
    this.stepEssFileService.evacuatedFromPrimary = this.evacDetailsForm.get(
      'evacuatedFromPrimary'
    ).value;
    this.stepEssFileService.evacAddress = this.evacDetailsForm.get(
      'evacAddress'
    ).value;
    this.stepEssFileService.facilityName = this.evacDetailsForm.get(
      'facilityName'
    ).value;
    this.stepEssFileService.insurance = this.evacDetailsForm.get(
      'insurance'
    ).value;
    this.stepEssFileService.evacuationImpact = this.evacDetailsForm.get(
      'householdAffected'
    ).value;
    this.stepEssFileService.householdRecoveryPlan = this.evacDetailsForm.get(
      'emergencySupportServices'
    ).value;
    this.stepEssFileService.referredServices = this.evacDetailsForm.get(
      'referredServices'
    ).value;
    this.stepEssFileService.referredServiceDetails = this.selection.selected;
    this.stepEssFileService.evacuationExternalReferrals = this.evacDetailsForm.get(
      'externalServices'
    ).value;
  }
}
