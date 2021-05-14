import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import {
  Country,
  LocationsService
} from 'src/app/core/services/locations.service';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { AddressService } from './address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, AfterViewChecked {
  primaryAddressForm: FormGroup;
  radioOption: string[] = ['Yes', 'No'];
  filteredOptions: Observable<Country[]>;
  mailingFilteredOptions: Observable<Country[]>;
  countries: Country[] = [];

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private cd: ChangeDetectorRef,
    private locationService: LocationsService,
    private addressService: AddressService
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
    this.primaryAddressForm = this.addressService.setDefaultPrimaryAddressValues(
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
    this.primaryAddressForm = this.addressService.setDefaultMailingAddressValues(
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
    this.updateTabStatus();
    this.router.navigate(['/ess-wizard/create-evacuee-profile/contact']);
  }

  /**
   * Navigate to previous tab
   */
  public back(): void {
    this.updateTabStatus();
    this.router.navigate([
      '/ess-wizard/create-evacuee-profile/evacuee-details'
    ]);
  }

  /**
   * Creates the address form
   */
  private createAddressForm(): void {
    this.primaryAddressForm = this.formBuilder.group({
      isBcAddress: [
        this.stepCreateProfileService.isBcAddress !== null
          ? this.stepCreateProfileService.isBcAddress
          : '',
        [Validators.required]
      ],
      isNewMailingAddress: [
        this.stepCreateProfileService.isMailingAddressSameAsPrimaryAddress !==
        null
          ? this.stepCreateProfileService.isMailingAddressSameAsPrimaryAddress
          : '',
        [Validators.required]
      ],
      isBcMailingAddress: [
        this.stepCreateProfileService.isBcMailingAddress !== null
          ? this.stepCreateProfileService.isBcMailingAddress
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
        this.stepCreateProfileService?.primaryAddressDetails?.addressLine1 !==
        undefined
          ? this.stepCreateProfileService.primaryAddressDetails.addressLine1
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      addressLine2: [
        this.stepCreateProfileService?.primaryAddressDetails?.addressLine2 !==
        undefined
          ? this.stepCreateProfileService.primaryAddressDetails.addressLine2
          : ''
      ],
      jurisdiction: [
        this.stepCreateProfileService?.primaryAddressDetails?.jurisdiction !==
        undefined
          ? this.stepCreateProfileService.primaryAddressDetails.jurisdiction
          : '',
        [Validators.required]
      ],
      stateProvince: [
        this.stepCreateProfileService?.primaryAddressDetails?.stateProvince !==
        undefined
          ? this.stepCreateProfileService.primaryAddressDetails.stateProvince
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
        this.stepCreateProfileService?.primaryAddressDetails?.country !==
        undefined
          ? this.stepCreateProfileService.primaryAddressDetails.country
          : '',
        [Validators.required]
      ],
      postalCode: [
        this.stepCreateProfileService?.primaryAddressDetails?.postalCode !==
        undefined
          ? this.stepCreateProfileService.primaryAddressDetails.postalCode
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
        this.stepCreateProfileService?.mailingAddressDetails?.addressLine1 !==
        undefined
          ? this.stepCreateProfileService.mailingAddressDetails.addressLine1
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      addressLine2: [
        this.stepCreateProfileService?.mailingAddressDetails?.addressLine2 !==
        undefined
          ? this.stepCreateProfileService.mailingAddressDetails.addressLine2
          : ''
      ],
      jurisdiction: [
        this.stepCreateProfileService?.mailingAddressDetails?.jurisdiction !==
        undefined
          ? this.stepCreateProfileService.mailingAddressDetails.jurisdiction
          : '',
        [Validators.required]
      ],
      stateProvince: [
        this.stepCreateProfileService?.mailingAddressDetails?.stateProvince !==
        undefined
          ? this.stepCreateProfileService.mailingAddressDetails.stateProvince
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
        this.stepCreateProfileService?.mailingAddressDetails?.country !==
        undefined
          ? this.stepCreateProfileService.mailingAddressDetails.country
          : '',
        [Validators.required]
      ],
      postalCode: [
        this.stepCreateProfileService?.mailingAddressDetails?.postalCode !==
        undefined
          ? this.stepCreateProfileService.mailingAddressDetails.postalCode
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
   * Updates the tab status
   */
  private updateTabStatus() {
    if (this.primaryAddressForm.valid) {
      this.stepCreateProfileService.setTabStatus('address', 'complete');
    } else if (this.primaryAddressForm.touched) {
      this.stepCreateProfileService.setTabStatus('address', 'incomplete');
    } else {
      this.stepCreateProfileService.setTabStatus('address', 'not-started');
    }
    this.saveFormUpdates();
  }

  /**
   * Persists the form values to the service
   */
  private saveFormUpdates(): void {
    this.stepCreateProfileService.primaryAddressDetails = this.primaryAddressForm.get(
      'address'
    ).value;
    this.stepCreateProfileService.mailingAddressDetails = this.primaryAddressForm.get(
      'mailingAddress'
    ).value;
    this.stepCreateProfileService.isBcAddress = this.primaryAddressForm.get(
      'isBcAddress'
    ).value;
    this.stepCreateProfileService.isMailingAddressSameAsPrimaryAddress = this.primaryAddressForm.get(
      'isNewMailingAddress'
    ).value;
    this.stepCreateProfileService.isBcMailingAddress = this.primaryAddressForm.get(
      'isBcMailingAddress'
    ).value;
  }
}
