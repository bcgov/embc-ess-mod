import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export default class AddressComponent implements OnInit {

  primaryAddressForm: FormGroup;
  primaryAddressForm$: Subscription;
  mailingAddressForm: FormGroup;
  mailingAddressForm$: Subscription;
  radioOption: string[] = ['Yes', 'No'];
  formBuilder: FormBuilder;
  formCreationService: FormCreationService;

  options: Array<any> = [
    { code: 'CAN', desc: 'Canada' },
    { code: 'USA', desc: 'United States of America' },
    { code: 'OTH', desc: 'Other' }
  ];
  filteredOptions: Observable<string[]>;

  constructor(@Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.primaryAddressForm$ = this.formCreationService.getPrimaryAddressForm().subscribe(primaryAddress => {
      this.primaryAddressForm = primaryAddress;
    });

    this.mailingAddressForm$ = this.formCreationService.getMailingAddressForm().subscribe(mailingAddress => {
      this.mailingAddressForm = mailingAddress;
    });

    this.filteredOptions = this.primaryAddressForm.get('address.country').valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );

    this.primaryAddressForm.get('isBcAddress').valueChanges.subscribe(value => {
      this.updateOnVisibility();
    })
  }

  /**
   * Filters the coutry list for autocomplete field
   * @param value : User typed value
   */
  private filter(value?: string): string[] {
    if (value !== null && value !== undefined) {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.desc.toLowerCase().indexOf(filterValue) === 0);
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
  get mailingAddressFormControl(): { [key: string]: AbstractControl; } {
    return this.mailingAddressForm.controls;
  }

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
    this.mailingAddressForm.get('address').reset();
    if (event.value === 'No') {
      this.mailingAddressForm.get('address.country').enable();
      this.mailingAddressForm.get('address.stateProvince').enable();
    }
  }

  updateOnVisibility() {
    this.primaryAddressForm.get('address.addressLine1').updateValueAndValidity();
    this.primaryAddressForm.get('address.jurisdiction').updateValueAndValidity();
    this.primaryAddressForm.get('address.stateProvince').updateValueAndValidity();
    this.primaryAddressForm.get('address.country').updateValueAndValidity();
    this.primaryAddressForm.get('address.postalCode').updateValueAndValidity();
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
