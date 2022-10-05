import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  Country,
  LocationsService
} from 'src/app/core/services/locations.service';
import { AddressService } from './address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, AfterViewChecked, OnDestroy {
  primaryAddressForm: UntypedFormGroup;
  radioOption: string[] = ['Yes', 'No'];
  filteredOptions: Observable<Country[]>;
  mailingFilteredOptions: Observable<Country[]>;
  countries: Country[] = [];
  tabUpdateSubscription: Subscription;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private locationService: LocationsService,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.addressService.init();
    this.primaryAddressForm = this.addressService.createForm();
    this.countries = this.locationService.getActiveCountriesList();

    this.filteredOptions = this.addressService.filterPrimaryCountry(
      this.primaryAddressForm,
      this.countries
    );
    this.mailingFilteredOptions = this.addressService.filterMailingCountry(
      this.primaryAddressForm,
      this.countries
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

    this.tabUpdateSubscription = this.addressService.updateTabStatus(
      this.primaryAddressForm
    );
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
  public get primaryAddressFormGroup(): UntypedFormGroup {
    return this.primaryAddressForm.get('address') as UntypedFormGroup;
  }

  /**
   * Returns the control of the mailing address form
   */
  public get mailingAddressFormGroup(): UntypedFormGroup {
    return this.primaryAddressForm.get('mailingAddress') as UntypedFormGroup;
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
    this.router.navigate([this.addressService?.tabMetaData?.next]);
  }

  /**
   * Navigate to previous tab
   */
  public back(): void {
    this.router.navigate([this.addressService?.tabMetaData?.previous]);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.addressService.cleanup(this.primaryAddressForm);
    this.tabUpdateSubscription.unsubscribe();
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
}
