import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { AddressFormsModule } from '../../address-forms/address-forms.module';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LocationService } from '../../../services/api/services/location.service';
import { Country } from 'src/app/core/services/api/models/country';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export default class AddressComponent implements OnInit {

  primaryAddressForm: FormGroup;
  primaryAddressForm$: Subscription;
  radioOption: string[] = ['Yes', 'No'];
  formBuilder: FormBuilder;
  formCreationService: FormCreationService;

  filteredOptions: Observable<Country[]>;
  mailingFilteredOptions: Observable<Country[]>;
  countries: Country[] = [];

  constructor(@Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService,
              private service: LocationService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {

    this.service.locationGetCountries().subscribe(countries => {
      this.countries = countries;
    });

    this.primaryAddressForm$ = this.formCreationService.getAddressForm().subscribe(primaryAddress => {
      this.primaryAddressForm = primaryAddress;
    });

    this.filteredOptions = this.primaryAddressForm.get('address.country').valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filter(value) : this.countries.slice())
    );

    this.mailingFilteredOptions = this.primaryAddressForm.get('mailingAddress.country').valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filter(value) : this.countries.slice())
    );

    this.primaryAddressForm.get('isBcAddress').valueChanges.subscribe(value => {
      this.updateOnVisibility();
    });

    this.primaryAddressForm.get('isNewMailingAddress').valueChanges.subscribe(value => {
      this.primaryAddressForm.get('isBcMailingAddress').updateValueAndValidity();
      console.log(this.primaryAddressForm);
    });

    this.primaryAddressForm.get('address').valueChanges.subscribe(value => {
      if (this.primaryAddressForm.get('isNewMailingAddress').value === 'Yes') {
        const primaryAddress = this.primaryAddressForm.getRawValue().address;
        this.primaryAddressForm.get('mailingAddress').setValue(primaryAddress);
      }
    });
  }

  /**
   * Filters the coutry list for autocomplete field
   * @param value : User typed value
   */
  private filter(value?: string): Country[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.countries.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  /**
   * Returns the control of the form
   */
  get primaryAddressFormControl(): { [key: string]: AbstractControl; } {
    return this.primaryAddressForm.controls;
  }

  /**
   * Returns the control of the form
   */
  // get mailingAddressFormControl(): { [key: string]: AbstractControl; } {
  //   return this.mailingAddressForm.controls;
  // }

  primaryAddressChange(event: MatRadioChange): void {
    this.primaryAddressForm.get('address').reset();
    if (event.value === 'No') {
      this.primaryAddressForm.get('address.country').enable();
      this.primaryAddressForm.get('address.stateProvince').enable();
    } else {
      this.primaryAddressForm.get('address.stateProvince').setValue('British Columbia');
      this.primaryAddressForm.get('address.stateProvince').disable();

      this.primaryAddressForm.get('address.country').setValue('Canada');
      this.primaryAddressForm.get('address.country').disable();
    }
  }

  mailingAddressChange(event: MatRadioChange): void {
    this.primaryAddressForm.get('mailingAddress').reset();
    if (event.value === 'No') {
      this.primaryAddressForm.get('mailingAddress.country').enable();
      this.primaryAddressForm.get('mailingAddress.stateProvince').enable();
    } else {
      this.primaryAddressForm.get('mailingAddress.stateProvince').patchValue('British Columbia');
      this.primaryAddressForm.get('mailingAddress.stateProvince').disable();

      this.primaryAddressForm.get('mailingAddress.country').setValue('Canada');
      this.primaryAddressForm.get('mailingAddress.country').disable();
    }
  }

  updateOnVisibility(): void {
    this.primaryAddressForm.get('address.addressLine1').updateValueAndValidity();
    this.primaryAddressForm.get('address.jurisdiction').updateValueAndValidity();
    this.primaryAddressForm.get('address.stateProvince').updateValueAndValidity();
    this.primaryAddressForm.get('address.country').updateValueAndValidity();
    this.primaryAddressForm.get('address.postalCode').updateValueAndValidity();
  }

  sameAsPrimary(event: MatRadioChange): void {
    if (event.value === 'Yes') {
      const primaryAddress = this.primaryAddressForm.getRawValue().address;
      // console.log(primaryAddress)
      this.primaryAddressForm.get('mailingAddress').setValue(primaryAddress);
    } else {
      this.primaryAddressForm.get('mailingAddress').reset();
    }
  }

  countryDisplayFn(country: Country): string {
    if (country) { return country.name; }
  }

}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    AddressFormsModule,
    MatAutocompleteModule
  ],
  declarations: [
    AddressComponent,
  ],
})
class AddressModule {

}
