import { Component, OnInit, NgModule, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
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
    {code:'CAN', desc: 'Canada'},
    {code:'USA', desc: 'United States of America'},
    {code:'OTH', desc: 'Other'}
  ];
  filteredOptions: Observable<string[]>;

  constructor(@Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
   }

  ngOnInit(): void {
    // this.addressForm = this.formBuilder.group({
    //   isBcAddress: ['', Validators.required],
    //   primaryAddress: this.formBuilder.group({

    //   })
    // });
    this.primaryAddressForm$ = this.formCreationService.getPrimaryAddressForm().subscribe(primaryAddress => {
      this.primaryAddressForm = primaryAddress;
    });

    this.mailingAddressForm$ = this.formCreationService.getMailingAddressForm().subscribe(mailingAddress => {
      this.mailingAddressForm = mailingAddress;
    })

    this.filteredOptions = this.primaryAddressForm.get('country').valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.desc.toLowerCase().indexOf(filterValue) === 0);
  }

  get primaryAddressFormControl() {
    return this.primaryAddressForm.controls;
  }

  get mailingAddressFormControl() {
    return this.mailingAddressForm.controls;
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
