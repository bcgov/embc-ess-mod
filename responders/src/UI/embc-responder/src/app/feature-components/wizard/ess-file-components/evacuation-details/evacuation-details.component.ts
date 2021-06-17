import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
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
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';

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

  constructor(
    public stepCreateProfileService: StepCreateProfileService,
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.createEvacDetailsForm();
    this.checkPrimaryAddress();

    // Evacuation Province/Country must always be system defaults
    this.evacDetailsForm
      .get('evacAddress.stateProvince')
      .setValue(globalConst.defaultProvince);

    this.evacDetailsForm
      .get('evacAddress.country')
      .setValue(globalConst.defaultCountry);

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
    if (this.stepCreateEssFileService.referredServices === true) {
      this.showReferredServicesForm = true;

      for (const option of this.stepCreateEssFileService
        .referredServiceDetails) {
        this.selection.toggle(option);
      }
    }

    // Display the Evacuation Address form if the answer is set as false
    if (this.stepCreateEssFileService.evacuatedFromPrimary === false) {
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
      this.evacDetailsForm
        .get('evacAddress')
        .setValue(this.stepCreateProfileService.primaryAddressDetails);
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
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  private createEvacDetailsForm(): void {
    if (!this.stepCreateEssFileService.referredServiceDetails)
      this.stepCreateEssFileService.referredServiceDetails = [];

    this.evacDetailsForm = this.formBuilder.group({
      paperESSFile: [
        this.stepCreateEssFileService.paperESSFile !== undefined
          ? this.stepCreateEssFileService.paperESSFile
          : ''
      ],
      evacuatedFromPrimary: [
        this.stepCreateEssFileService.evacuatedFromPrimary !== null
          ? this.stepCreateEssFileService.evacuatedFromPrimary
          : '',
        Validators.required
      ],
      facilityName: [
        this.stepCreateEssFileService.facilityName !== undefined
          ? this.stepCreateEssFileService.facilityName
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      insurance: [
        this.stepCreateEssFileService.insurance !== undefined
          ? this.stepCreateEssFileService.insurance
          : '',
        Validators.required
      ],
      householdAffected: [
        this.stepCreateEssFileService.evacuationImpact !== undefined
          ? this.stepCreateEssFileService.evacuationImpact
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      emergencySupportServices: [
        this.stepCreateEssFileService.householdRecoveryPlan !== undefined
          ? this.stepCreateEssFileService.householdRecoveryPlan
          : ''
      ],
      referredServices: [
        this.stepCreateEssFileService.referredServices !== undefined
          ? this.stepCreateEssFileService.referredServices
          : ''
      ],
      referredServiceDetails: [
        this.stepCreateEssFileService.referredServiceDetails,
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
        this.stepCreateEssFileService.evacuationExternalReferrals !== undefined
          ? this.stepCreateEssFileService.evacuationExternalReferrals
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
        this.stepCreateEssFileService?.evacAddress?.addressLine1 !== undefined
          ? this.stepCreateEssFileService.evacAddress.addressLine1
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      addressLine2: [
        this.stepCreateEssFileService?.evacAddress?.addressLine2 !== undefined
          ? this.stepCreateEssFileService.evacAddress.addressLine2
          : ''
      ],
      community: [
        this.stepCreateEssFileService?.evacAddress?.community !== undefined
          ? this.stepCreateEssFileService.evacAddress.community
          : '',
        [Validators.required]
      ],
      stateProvince: [
        this.stepCreateEssFileService?.evacAddress?.stateProvince !== undefined
          ? this.stepCreateEssFileService.evacAddress.stateProvince
          : '',
        [Validators.required]
      ],
      country: [
        this.stepCreateEssFileService?.evacAddress?.country !== undefined
          ? this.stepCreateEssFileService.evacAddress.country
          : '',
        [Validators.required]
      ],
      postalCode: [
        this.stepCreateEssFileService?.evacAddress?.postalCode !== undefined
          ? this.stepCreateEssFileService.evacAddress.postalCode
          : '',
        [this.customValidation.postalValidation().bind(this.customValidation)]
      ]
    });
  }

  /**
   * Checks if the inserted primary address is in BC Province
   */
  private checkPrimaryAddress() {
    if (
      this.stepCreateProfileService?.primaryAddressDetails?.stateProvince
        .code !== 'BC'
    ) {
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
    this.stepCreateEssFileService.paperESSFile = this.evacDetailsForm.get(
      'paperESSFile'
    ).value;
    this.stepCreateEssFileService.evacuatedFromPrimary = this.evacDetailsForm.get(
      'evacuatedFromPrimary'
    ).value;
    this.stepCreateEssFileService.evacAddress = this.evacDetailsForm.get(
      'evacAddress'
    ).value;
    this.stepCreateEssFileService.facilityName = this.evacDetailsForm.get(
      'facilityName'
    ).value;
    this.stepCreateEssFileService.insurance = this.evacDetailsForm.get(
      'insurance'
    ).value;
    this.stepCreateEssFileService.evacuationImpact = this.evacDetailsForm.get(
      'householdAffected'
    ).value;
    this.stepCreateEssFileService.householdRecoveryPlan = this.evacDetailsForm.get(
      'emergencySupportServices'
    ).value;
    this.stepCreateEssFileService.referredServices = this.evacDetailsForm.get(
      'referredServices'
    ).value;
    this.stepCreateEssFileService.referredServiceDetails = this.selection.selected;
    this.stepCreateEssFileService.evacuationExternalReferrals = this.evacDetailsForm.get(
      'externalServices'
    ).value;
  }
}
