import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import * as globalConst from '../../../../core/services/global-constants';
import * as moment from 'moment';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import { Subscription } from 'rxjs';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { WizardService } from '../../wizard.service';
import { TabModel } from 'src/app/core/models/tab.model';
import { EvacueeSearchService } from 'src/app/feature-components/search/evacuee-search/evacuee-search.service';
import { DateConversionService } from 'src/app/core/services/utility/dateConversion.service';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Component({
  selector: 'app-evacuation-details',
  templateUrl: './evacuation-details.component.html',
  styleUrls: ['./evacuation-details.component.scss']
})
export class EvacuationDetailsComponent implements OnInit, OnDestroy {
  evacDetailsForm: UntypedFormGroup;
  insuranceOption = globalConst.insuranceOptions;
  radioOption = globalConst.radioButtonOptions;
  referredServicesOption = globalConst.referredServiceOptions;
  defaultCountry = globalConst.defaultCountry;
  defaultProvince = globalConst.defaultProvince;

  showReferredServicesForm = false;
  showBCAddressForm = false;
  isBCAddress = true;
  showInsuranceMsg = false;

  wizardType: string;
  essFileNumber: string;

  selection = new SelectionModel<any>(true, []);
  tabUpdateSubscription: Subscription;
  tabMetaData: TabModel;

  constructor(
    public stepEssFileService: StepEssFileService,
    public evacueeSessionService: EvacueeSessionService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private customValidation: CustomValidationService,
    private wizardService: WizardService,
    public evacueeSearchService: EvacueeSearchService,
    private dateConversionService: DateConversionService,
    private appBaseService: AppBaseService
  ) {}

  paperCompletedDateFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    return moment(date).isBetween(
      moment(this.stepEssFileService?.getTaskEndDate()),
      moment(new Date()),
      'D',
      '[]'
    );
  };

  ngOnInit(): void {
    this.wizardType = this.appBaseService?.wizardProperties?.wizardType;
    this.essFileNumber = this.appBaseService?.appModel?.selectedEssFile?.id;
    if (
      this.wizardType !== WizardType.NewEssFile &&
      this.wizardType !== WizardType.NewRegistration
    ) {
      this.stepEssFileService.paperESSFile =
        this.stepEssFileService?.selectedEssFile?.manualFileId;
    } else {
      this.stepEssFileService.paperESSFile =
        this.evacueeSearchService?.evacueeSearchContext?.evacueeSearchParameters
          ?.paperFileNumber !== 'undefined'
          ? this.evacueeSearchService?.evacueeSearchContext
              ?.evacueeSearchParameters?.paperFileNumber
          : '';
    }

    this.createEvacDetailsForm();
    this.checkAddress();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEssFileService.nextTabUpdate.subscribe(() => {
        this.updateTabStatus();
      });

    // Update Value and Validity for referredServiceDetails if referredServices changes
    this.evacDetailsForm
      .get('referredServices')
      .valueChanges.subscribe((value) => {
        this.evacDetailsForm
          .get('referredServiceDetails')
          .updateValueAndValidity();
      });

    // Updates the validations for the evacFromPrimary formControl
    this.evacDetailsForm
      .get('primaryAddressIndicator')
      .valueChanges.subscribe(() => this.updateOnVisibility());

    // Display the referredServiceDetails in case referred Service is set as true
    if (this.stepEssFileService.referredServices === 'Yes') {
      this.showReferredServicesForm = true;

      for (const option of this.stepEssFileService.referredServiceDetails) {
        this.selection.toggle(option);
      }
    }

    // Display the Evacuation Address form if the answer is set as false
    if (
      this.stepEssFileService.evacuatedFromPrimary === 'No' &&
      this.isBCAddress === true
    ) {
      this.showBCAddressForm = true;
    }

    this.tabMetaData =
      this.stepEssFileService.getNavLinks('evacuation-details');
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
    if (event.value === 'Yes') {
      this.showBCAddressForm = false;
      this.evacDetailsForm
        .get('evacAddress')
        .setValue(this.stepEssFileService.primaryAddress);
    } else {
      this.evacDetailsForm.get('evacAddress').reset();

      // Make sure province/country are set to BC/Can when address form displayed
      this.evacDetailsForm
        .get('evacAddress.stateProvince')
        .setValue(globalConst.defaultProvince);

      this.evacDetailsForm
        .get('evacAddress.country')
        .setValue(globalConst.defaultCountry);

      this.showBCAddressForm = true;
    }
  }

  /**
   * Listens to changes on the Referred Services option
   *
   * @param event
   */
  referredServiceChange(event: MatRadioChange): void {
    if (event.value === 'Yes') {
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
  public get evacAddressFormGroup(): UntypedFormGroup {
    return this.evacDetailsForm.get('evacAddress') as UntypedFormGroup;
  }

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    this.router.navigate([this.tabMetaData?.next]);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (this.stepEssFileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(
        this.evacDetailsForm.controls,
        'evacDetails'
      );

      this.wizardService.setEditStatus({
        tabName: 'evacDetails',
        tabUpdateStatus: isFormUpdated
      });
      this.stepEssFileService.updateEditedFormStatus();
    }
    this.stepEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  /**
   * Creates a new Evacuation Details form
   */
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
        this.customValidation
          .conditionalValidation(
            () =>
              this.evacDetailsForm.get('primaryAddressIndicator').value ===
              true,
            Validators.required
          )
          .bind(this.customValidation)
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
              () =>
                this.evacDetailsForm.get('referredServices').value === 'Yes',
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
      primaryAddressIndicator: [true],
      evacAddress: this.createEvacAddressForm(),
      paperIssuedBy: this.formBuilder.group({
        firstName: [
          this.stepEssFileService.completedBy
            ? this.stepEssFileService.completedBy.split(' ')[0]
            : '',
          [
            this.customValidation
              .conditionalValidation(
                () => this.evacueeSessionService.isPaperBased,
                this.customValidation.whitespaceValidator()
              )
              .bind(this.customValidation)
          ]
        ],
        lastNameInitial: [
          this.stepEssFileService.completedBy
            ? this.stepEssFileService.completedBy.split(' ')[1]
            : '',
          [
            this.customValidation
              .conditionalValidation(
                () => this.evacueeSessionService.isPaperBased,
                this.customValidation.whitespaceValidator()
              )
              .bind(this.customValidation)
          ]
        ]
      }),
      paperCompletedOn: [
        this.stepEssFileService.completedOn
          ? this.dateConversionService.convertDateTimeToDate(
              this.stepEssFileService.completedOn
            )
          : '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.evacueeSessionService.isPaperBased,
              Validators.required
            )
            .bind(this.customValidation),
          this.customValidation
            .conditionalValidation(
              () => this.evacueeSessionService.isPaperBased,
              this.customValidation.validDateValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      paperCompletedTime: [
        this.stepEssFileService.completedOn
          ? this.dateConversionService.convertDateTimeToTime(
              this.stepEssFileService.completedOn
            )
          : '',
        [
          this.customValidation
            .conditionalValidation(
              () => this.evacueeSessionService.isPaperBased,
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ]
    });
  }

  /**
   * Creates the primary address form
   *
   * @returns form group
   */
  private createEvacAddressForm(): UntypedFormGroup {
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
          : globalConst.defaultProvince,
        [Validators.required]
      ],
      country: [
        this.stepEssFileService?.evacAddress?.country !== undefined
          ? this.stepEssFileService.evacAddress.country
          : globalConst.defaultCountry,
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
      this.isBCAddress = false;

      // Make sure province/country are set to BC/Can whenever address form is displayed
      // Only set when displayed, otherwise run into "incomplete step status" issues
      this.evacDetailsForm
        .get('evacAddress.stateProvince')
        .setValue(globalConst.defaultProvince);

      this.evacDetailsForm
        .get('evacAddress.country')
        .setValue(globalConst.defaultCountry);

      this.evacDetailsForm.get('primaryAddressIndicator').setValue(false);
    }
  }

  /**
   * Updates the validations for personalDetailsForm
   */
  private updateOnVisibility(): void {
    this.evacDetailsForm.get('evacuatedFromPrimary').updateValueAndValidity();
  }

  /**
   * Updates the Tab Status from Incomplete, Complete or in Progress
   */
  private updateTabStatus() {
    if (this.evacDetailsForm.valid) {
      this.stepEssFileService.setTabStatus('evacuation-details', 'complete');
    } else if (
      this.stepEssFileService.checkForEvacDetailsPartialUpdates(
        this.evacDetailsForm
      )
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
    if (
      this.evacueeSessionService.isPaperBased ||
      this.stepEssFileService.paperESSFile
    ) {
      this.savePaperFields();
    }
    this.stepEssFileService.evacuatedFromPrimary = this.evacDetailsForm.get(
      'evacuatedFromPrimary'
    ).value;
    this.stepEssFileService.evacAddress =
      this.evacDetailsForm.get('evacAddress').value;
    this.stepEssFileService.facilityName =
      this.evacDetailsForm.get('facilityName').value;
    this.stepEssFileService.insurance =
      this.evacDetailsForm.get('insurance').value;
    this.stepEssFileService.evacuationImpact =
      this.evacDetailsForm.get('householdAffected').value;
    this.stepEssFileService.householdRecoveryPlan = this.evacDetailsForm.get(
      'emergencySupportServices'
    ).value;
    this.stepEssFileService.referredServices =
      this.evacDetailsForm.get('referredServices').value;
    this.stepEssFileService.referredServiceDetails = this.selection.selected;
    this.stepEssFileService.evacuationExternalReferrals =
      this.evacDetailsForm.get('externalServices').value;
  }

  private savePaperFields() {
    this.stepEssFileService.paperESSFile =
      this.evacDetailsForm.get('paperESSFile').value;
    this.stepEssFileService.completedOn =
      this.dateConversionService.createDateTimeString(
        this.evacDetailsForm.get('paperCompletedOn').value,
        this.evacDetailsForm.get('paperCompletedTime').value
      );
    this.stepEssFileService.completedBy =
      this.evacDetailsForm.get('paperIssuedBy.firstName').value +
      ' ' +
      this.evacDetailsForm.get('paperIssuedBy.lastNameInitial').value;
  }
}
