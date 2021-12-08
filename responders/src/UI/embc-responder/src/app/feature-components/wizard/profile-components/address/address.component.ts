import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import {
  Country,
  LocationsService
} from 'src/app/core/services/locations.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { AddressService } from './address.service';
import { WizardService } from '../../wizard.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, AfterViewChecked, OnDestroy {
  primaryAddressForm: FormGroup;
  radioOption: string[] = ['Yes', 'No'];
  filteredOptions: Observable<Country[]>;
  mailingFilteredOptions: Observable<Country[]>;
  countries: Country[] = [];
  tabUpdateSubscription: Subscription;

  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private cd: ChangeDetectorRef,
    private locationService: LocationsService,
    private addressService: AddressService,
    private wizardService: WizardService
  ) {}

  ngOnInit(): void {
    this.createAddressForm();
    this.countries = this.locationService.getCountriesList();

    this.filteredOptions = this.primaryAddressForm
      .get('address.country')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? this.filter(value) : this.countries.slice()))
      );

    this.mailingFilteredOptions = this.primaryAddressForm
      .get('mailingAddress.country')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? this.filter(value) : this.countries.slice()))
      );

    this.primaryAddressForm
      .get('address.country')
      .valueChanges.subscribe((value) => {
        this.primaryAddressForm
          .get('address.stateProvince')
          .updateValueAndValidity();
      });

    this.primaryAddressForm
      .get('mailingAddress.country')
      .valueChanges.subscribe((value) => {
        this.primaryAddressForm
          .get('mailingAddress.stateProvince')
          .updateValueAndValidity();
      });

    this.primaryAddressForm
      .get('isBcAddress')
      .valueChanges.subscribe((value) => {
        this.updateOnVisibility();
      });

    this.primaryAddressForm
      .get('isNewMailingAddress')
      .valueChanges.subscribe((value) => {
        this.primaryAddressForm
          .get('isBcMailingAddress')
          .updateValueAndValidity();
      });

    this.primaryAddressForm.get('address').valueChanges.subscribe((value) => {
      if (this.primaryAddressForm.get('isNewMailingAddress').value === 'Yes') {
        const primaryAddress = this.primaryAddressForm.getRawValue().address;
        this.primaryAddressForm.get('mailingAddress').setValue(primaryAddress);
      }
    });

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
        this.updateTabStatus();
      });
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  /**
   * Custom validation for country
   *
   * @param control form field control
   * @returns true/false
   */
  public validateCountry(control: AbstractControl): boolean {
    const currentCountry = control.value;
    let invalidCountry = false;
    if (currentCountry !== null && currentCountry.name === undefined) {
      invalidCountry = !invalidCountry;
      control.setErrors({ invalidCountry: true });
    }
    return invalidCountry;
  }

  /**
   * Returns the control of the form
   */
  public get primaryAddressFormControl(): { [key: string]: AbstractControl } {
    return this.primaryAddressForm.controls;
  }

  /**
   * Returns the control of the primary address form
   */
  public get primaryAddressFormGroup(): FormGroup {
    return this.primaryAddressForm.get('address') as FormGroup;
  }

  /**
   * Returns the control of the mailing address form
   */
  public get mailingAddressFormGroup(): FormGroup {
    return this.primaryAddressForm.get('mailingAddress') as FormGroup;
  }

  /**
   * Updates the address form based on country selected
   *
   * @param event MatAutocompleteSelectedEvent
   */
  public setCountryConfig(event: MatAutocompleteSelectedEvent): void {
    this.primaryAddressForm = this.addressService.clearPrimaryAddressFields(
      this.primaryAddressForm
    );
    this.updateOnVisibility();
  }

  /**
   * Updates the mailing address form based on country selected
   *
   * @param event MatAutocompleteSelectedEvent
   */
  public setMailingCountryConfig(event: MatAutocompleteSelectedEvent): void {
    this.primaryAddressForm = this.addressService.clearMailingAddressFields(
      this.primaryAddressForm
    );
    this.updateOnVisibility();
  }

  /**
   * Sets default values of primary address
   *
   * @param event radio change event
   */
  public primaryAddressChange(event: MatRadioChange): void {
    this.primaryAddressForm =
      this.addressService.setDefaultPrimaryAddressValues(
        this.primaryAddressForm,
        event
      );
  }

  /**
   * Sets default values of mailing address
   *
   * @param event radio change event
   */
  public mailingAddressChange(event: MatRadioChange): void {
    this.primaryAddressForm =
      this.addressService.setDefaultMailingAddressValues(
        this.primaryAddressForm,
        event
      );
  }

  /**
   * If yes, updates the mailing address to be same as primary adddress
   * else, resets and renders the mailing address form
   *
   * @param event radio change event
   */
  public sameAsPrimary(event: MatRadioChange): void {
    if (event.value === 'Yes') {
      const primaryAddress = this.primaryAddressForm.getRawValue().address;
      this.primaryAddressForm.get('mailingAddress').setValue(primaryAddress);
    } else {
      this.primaryAddressForm.get('mailingAddress').reset();
      this.primaryAddressForm.get('isBcMailingAddress').reset();
    }
  }

  /**
   * Country name
   *
   * @param country value in country array
   * @returns name of the country
   */
  public countryDisplayFn(country: Country): string {
    if (country) {
      return country.name;
    }
  }

  /**
   * Navigate to next tab
   */
  public next(): void {
    this.router.navigate(['/ess-wizard/evacuee-profile/contact']);
  }

  /**
   * Navigate to previous tab
   */
  public back(): void {
    this.router.navigate(['/ess-wizard/evacuee-profile/evacuee-details']);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    if (this.stepEvacueeProfileService.checkForEdit()) {
      const isPrimaryFormUpdated = this.wizardService.hasChanged(
        this.primaryAddressForm.controls,
        'primaryAddress'
      );

      const isMailingFormUpdated = this.wizardService.hasChanged(
        this.primaryAddressForm.controls,
        'mailingAddress'
      );

      this.wizardService.setEditStatus({
        tabName: 'address',
        tabUpdateStatus: isPrimaryFormUpdated || isMailingFormUpdated
      });
      this.stepEvacueeProfileService.updateEditedFormStatus();
    }
    this.stepEvacueeProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  /**
   * Creates the address form
   */
  private createAddressForm(): void {
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
  }

  /**
   * Creates the primary address form
   *
   * @returns form group
   */
  private createPrimaryAddressForm(): FormGroup {
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
                (this.addressService.compareObjects(
                  this.primaryAddressForm.get('address.country').value,
                  globalConst.defaultCountry
                ) ||
                  this.addressService.compareObjects(
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
  private createMailingAddressForm(): FormGroup {
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
                (this.addressService.compareObjects(
                  this.primaryAddressForm.get('mailingAddress.country').value,
                  globalConst.defaultCountry
                ) ||
                  this.addressService.compareObjects(
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

  /**
   * Filters the coutry list for autocomplete field
   *
   * @param value : User typed value
   */
  private filter(value?: string): Country[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.countries.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  /**
   * Updates the value and validity of the forms
   */
  private updateOnVisibility(): void {
    this.primaryAddressForm = this.addressService.updateOnVisibility(
      this.primaryAddressForm
    );
    this.cd.detectChanges();
  }

  /**
   * Checks the form validity and updates the tab status
   */
  private updateTabStatus() {
    if (this.primaryAddressForm.valid) {
      this.stepEvacueeProfileService.setTabStatus('address', 'complete');
    } else if (
      this.stepEvacueeProfileService.checkForPartialUpdates(
        this.primaryAddressForm
      )
    ) {
      this.stepEvacueeProfileService.setTabStatus('address', 'incomplete');
    } else {
      this.stepEvacueeProfileService.setTabStatus('address', 'not-started');
    }
    this.saveFormUpdates();
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
}
