import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../../../core/services/formCreation.service';

import * as globalConst from '../../../../core/services/globalConstants';

import { BcAddressComponent } from '../../address-forms/bc-address/bc-address.component';

@Component({
  selector: 'app-evac-address',
  templateUrl: './evac-address.component.html',
  styleUrls: ['./evac-address.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatRadioModule, MatFormFieldModule, BcAddressComponent, AsyncPipe]
})
export default class EvacAddressComponent implements OnInit {
  primaryAddressForm: UntypedFormGroup;
  evacuatedForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  primaryAddressForm$: Subscription;
  evacuatedForm$: Subscription;
  formCreationService: FormCreationService;
  insuranceOption = globalConst.insuranceOptions;

  // registrationAddress: Partial<Registration>;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.evacuatedForm$ = this.formCreationService.getEvacuatedForm().subscribe((evacuatedForm) => {
      this.evacuatedForm = evacuatedForm;
    });

    this.primaryAddressForm$ = this.formCreationService.getAddressForm().subscribe((primaryAddressForm) => {
      this.primaryAddressForm = primaryAddressForm;
    });

    this.otherAddressTemplate();
  }

  evacPrimaryAddressChange(event: MatRadioChange): void {
    if (event.value === 'Yes') {
      this.evacuatedForm.get('evacuatedFromAddress').setValue(this.primaryAddressForm.get('address').value);
    } else {
      this.evacuatedForm.get('evacuatedFromAddress').reset();
      this.evacuatedForm.get('evacuatedFromAddress.stateProvince').setValue(globalConst.defaultProvince);
      this.evacuatedForm.get('evacuatedFromAddress.country').setValue(globalConst.defaultCountry);
    }
  }

  otherAddressTemplate(): void {
    if (this.evacuatedForm.get('evacuatedFromAddress.stateProvince').value === '') {
      this.evacuatedForm.get('evacuatedFromAddress').reset();
      this.evacuatedForm.get('evacuatedFromAddress.stateProvince').setValue(globalConst.defaultProvince);
      this.evacuatedForm.get('evacuatedFromAddress.country').setValue(globalConst.defaultCountry);
    }
  }

  /**
   * Returns the control of the form
   */
  get evacuatedFormControl(): { [key: string]: AbstractControl } {
    return this.evacuatedForm.controls;
  }
}
