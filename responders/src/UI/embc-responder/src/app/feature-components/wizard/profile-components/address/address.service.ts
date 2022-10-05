import { Injectable } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { map, startWith, Subscription } from 'rxjs';
import { TabModel } from 'src/app/core/models/tab.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { Country } from 'src/app/core/services/locations.service';
import * as globalConst from '../../../../core/services/global-constants';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from '../../wizard.service';

@Injectable({ providedIn: 'root' })
export class AddressService {
  primaryAddressForm: UntypedFormGroup;
  private tabMetaDataVal: TabModel;

  public get tabMetaData(): TabModel {
    return this.tabMetaDataVal;
  }
  public set tabMetaData(value: TabModel) {
    this.tabMetaDataVal = value;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private customValidation: CustomValidationService,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private wizardService: WizardService
  ) {}

  init() {
    this.tabMetaData = this.stepEvacueeProfileService.getNavLinks('address');
  }

  public createForm(): UntypedFormGroup {
    this.primaryAddressForm = this.formBuilder.group({
      isBcAddress: [
        this.stepEvacueeProfileService.isBcAddress !== null
          ? this.stepEvacueeProfileService.isBcAddress
          : '',
        [Validators.required]
      ],
      isNewMailingAddress: [
        this.stepEvacueeProfileService.isMailingAddressSameAsPrimaryAddress !==
        null
          ? this.stepEvacueeProfileService.isMailingAddressSameAsPrimaryAddress
          : '',
        [Validators.required]
      ],
      isBcMailingAddress: [
        this.stepEvacueeProfileService.isBcMailingAddress !== null
          ? this.stepEvacueeProfileService.isBcMailingAddress
          : '',
        [
          this.customValidation
            .conditionalValidation(
              () =>
                this.primaryAddressForm.get('isNewMailingAddress').value ===
                'No',
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ],
      address: this.createPrimaryAddressForm(),
      mailingAddress: this.createMailingAddressForm()
    });

    return this.primaryAddressForm;
  }

  public updateTabStatus(form: UntypedFormGroup): Subscription {
    return this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
      if (form.valid) {
        this.stepEvacueeProfileService.setTabStatus('address', 'complete');
      } else if (this.stepEvacueeProfileService.checkForPartialUpdates(form)) {
        this.stepEvacueeProfileService.setTabStatus('address', 'incomplete');
      } else {
        this.stepEvacueeProfileService.setTabStatus('address', 'not-started');
      }
      this.saveFormUpdates();
    });
  }

  public cleanup(form: UntypedFormGroup) {
    if (this.stepEvacueeProfileService.checkForEdit()) {
      const isPrimaryFormUpdated = this.wizardService.hasChanged(
        form.controls,
        'primaryAddress'
      );

      const isMailingFormUpdated = this.wizardService.hasChanged(
        form.controls,
        'mailingAddress'
      );

      this.wizardService.setEditStatus({
        tabName: 'address',
        tabUpdateStatus: isPrimaryFormUpdated || isMailingFormUpdated
      });
      this.stepEvacueeProfileService.updateEditedFormStatus();
    }
    this.stepEvacueeProfileService.nextTabUpdate.next();
  }

  public clearPrimaryAddressFields(
    primaryAddressForm: UntypedFormGroup
  ): UntypedFormGroup {
    primaryAddressForm.get('address.addressLine1').reset();
    primaryAddressForm.get('address.addressLine2').reset();
    primaryAddressForm.get('address.community').reset();
    primaryAddressForm.get('address.stateProvince').reset();
    primaryAddressForm.get('address.postalCode').reset();

    return primaryAddressForm;
  }

  public clearMailingAddressFields(
    primaryAddressForm: UntypedFormGroup
  ): UntypedFormGroup {
    primaryAddressForm.get('mailingAddress.addressLine1').reset();
    primaryAddressForm.get('mailingAddress.addressLine2').reset();
    primaryAddressForm.get('mailingAddress.community').reset();
    primaryAddressForm.get('mailingAddress.stateProvince').reset();
    primaryAddressForm.get('mailingAddress.postalCode').reset();

    return primaryAddressForm;
  }

  public setDefaultPrimaryAddressValues(
    primaryAddressForm: UntypedFormGroup,
    event: MatRadioChange
  ): UntypedFormGroup {
    primaryAddressForm.get('address').reset();
    if (event.value === 'Yes') {
      primaryAddressForm
        .get('address.stateProvince')
        .setValue(globalConst.defaultProvince);
      primaryAddressForm
        .get('address.country')
        .setValue(globalConst.defaultCountry);
    }

    return primaryAddressForm;
  }

  public setDefaultMailingAddressValues(
    primaryAddressForm: UntypedFormGroup,
    event: MatRadioChange
  ): UntypedFormGroup {
    primaryAddressForm.get('mailingAddress').reset();
    if (event.value === 'Yes') {
      primaryAddressForm
        .get('mailingAddress.stateProvince')
        .setValue(globalConst.defaultProvince);
      primaryAddressForm
        .get('mailingAddress.country')
        .setValue(globalConst.defaultCountry);
    }

    return primaryAddressForm;
  }

  public updateOnVisibility(
    primaryAddressForm: UntypedFormGroup
  ): UntypedFormGroup {
    primaryAddressForm.get('address.addressLine1').updateValueAndValidity();
    primaryAddressForm.get('address.community').updateValueAndValidity();
    primaryAddressForm.get('address.stateProvince').updateValueAndValidity();
    primaryAddressForm.get('address.country').updateValueAndValidity();
    primaryAddressForm.get('address.postalCode').updateValueAndValidity();

    return primaryAddressForm;
  }

  public compareObjects<T extends Country>(c1: T, c2: T): boolean {
    if (c1 === null || c2 === null || c1 === undefined || c2 === undefined) {
      return null;
    }
    return c1.code === c2.code;
  }

  public isSameMailingAddress(
    isMailingAddressSameAsPrimaryAddress: boolean
  ): string {
    return isMailingAddressSameAsPrimaryAddress === true ? 'Yes' : 'No';
  }

  public isBCAddress(province: null | string): string {
    return province !== null && province === 'BC' ? 'Yes' : 'No';
  }

  public filterPrimaryCountry(form: UntypedFormGroup, countries: Country[]) {
    return form.get('address.country').valueChanges.pipe(
      startWith(''),
      map((value) =>
        value ? this.filter(value, countries) : countries.slice()
      )
    );
  }

  public filterMailingCountry(form: UntypedFormGroup, countries: Country[]) {
    return form.get('mailingAddress.country').valueChanges.pipe(
      startWith(''),
      map((value) =>
        value ? this.filter(value, countries) : countries.slice()
      )
    );
  }

  /**
   * Persists the form values to the service
   */
  private saveFormUpdates(): void {
    this.stepEvacueeProfileService.primaryAddressDetails =
      this.primaryAddressForm.get('address').value;
    this.stepEvacueeProfileService.mailingAddressDetails =
      this.primaryAddressForm.get('mailingAddress').value;
    this.stepEvacueeProfileService.isBcAddress =
      this.primaryAddressForm.get('isBcAddress').value;
    this.stepEvacueeProfileService.isMailingAddressSameAsPrimaryAddress =
      this.primaryAddressForm.get('isNewMailingAddress').value;
    this.stepEvacueeProfileService.isBcMailingAddress =
      this.primaryAddressForm.get('isBcMailingAddress').value;
  }

  /**
   * Filters the coutry list for autocomplete field
   *
   * @param value : User typed value
   */
  private filter(value: string, countries: Country[]): Country[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return countries.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  /**
   * Creates the primary address form
   *
   * @returns form group
   */
  private createPrimaryAddressForm(): UntypedFormGroup {
    return this.formBuilder.group({
      addressLine1: [
        this.stepEvacueeProfileService?.primaryAddressDetails?.addressLine1 !==
        undefined
          ? this.stepEvacueeProfileService.primaryAddressDetails.addressLine1
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      addressLine2: [
        this.stepEvacueeProfileService?.primaryAddressDetails?.addressLine2 !==
        undefined
          ? this.stepEvacueeProfileService.primaryAddressDetails.addressLine2
          : ''
      ],
      community: [
        this.stepEvacueeProfileService?.primaryAddressDetails?.community !==
        undefined
          ? this.stepEvacueeProfileService.primaryAddressDetails.community
          : '',
        [Validators.required]
      ],
      stateProvince: [
        this.stepEvacueeProfileService?.primaryAddressDetails?.stateProvince !==
        undefined
          ? this.stepEvacueeProfileService.primaryAddressDetails.stateProvince
          : '',
        [
          this.customValidation
            .conditionalValidation(
              () =>
                this.primaryAddressForm.get('address.country').value !== null &&
                (this.compareObjects(
                  this.primaryAddressForm.get('address.country').value,
                  globalConst.defaultCountry
                ) ||
                  this.compareObjects(
                    this.primaryAddressForm.get('address.country').value,
                    globalConst.usDefaultObject
                  )),
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ],
      country: [
        this.stepEvacueeProfileService?.primaryAddressDetails?.country !==
        undefined
          ? this.stepEvacueeProfileService.primaryAddressDetails.country
          : '',
        [Validators.required]
      ],
      postalCode: [
        this.stepEvacueeProfileService?.primaryAddressDetails?.postalCode !==
        undefined
          ? this.stepEvacueeProfileService.primaryAddressDetails.postalCode
          : '',
        [this.customValidation.postalValidation().bind(this.customValidation)]
      ]
    });
  }

  /**
   * Creates the mailing address form
   *
   * @returns form group
   */
  private createMailingAddressForm(): UntypedFormGroup {
    return this.formBuilder.group({
      addressLine1: [
        this.stepEvacueeProfileService?.mailingAddressDetails?.addressLine1 !==
        undefined
          ? this.stepEvacueeProfileService.mailingAddressDetails.addressLine1
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      addressLine2: [
        this.stepEvacueeProfileService?.mailingAddressDetails?.addressLine2 !==
        undefined
          ? this.stepEvacueeProfileService.mailingAddressDetails.addressLine2
          : ''
      ],
      community: [
        this.stepEvacueeProfileService?.mailingAddressDetails?.community !==
        undefined
          ? this.stepEvacueeProfileService.mailingAddressDetails.community
          : '',
        [Validators.required]
      ],
      stateProvince: [
        this.stepEvacueeProfileService?.mailingAddressDetails?.stateProvince !==
        undefined
          ? this.stepEvacueeProfileService.mailingAddressDetails.stateProvince
          : '',
        [
          this.customValidation
            .conditionalValidation(
              () =>
                this.primaryAddressForm.get('mailingAddress.country').value !==
                  null &&
                (this.compareObjects(
                  this.primaryAddressForm.get('mailingAddress.country').value,
                  globalConst.defaultCountry
                ) ||
                  this.compareObjects(
                    this.primaryAddressForm.get('mailingAddress.country').value,
                    globalConst.usDefaultObject
                  )),
              Validators.required
            )
            .bind(this.customValidation)
        ]
      ],
      country: [
        this.stepEvacueeProfileService?.mailingAddressDetails?.country !==
        undefined
          ? this.stepEvacueeProfileService.mailingAddressDetails.country
          : '',
        [Validators.required]
      ],
      postalCode: [
        this.stepEvacueeProfileService?.mailingAddressDetails?.postalCode !==
        undefined
          ? this.stepEvacueeProfileService.mailingAddressDetails.postalCode
          : '',
        [this.customValidation.postalValidation().bind(this.customValidation)]
      ]
    });
  }
}
