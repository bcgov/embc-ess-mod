import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import {
  Country,
  LocationsService
} from 'src/app/core/services/locations.service';
import * as globalConst from '../../../../core/services/global-constants';

@Injectable({ providedIn: 'root' })
export class AddressService {
  constructor() {}

  public clearPrimaryAddressFields(primaryAddressForm: FormGroup): FormGroup {
    primaryAddressForm.get('address.addressLine1').reset();
    primaryAddressForm.get('address.addressLine2').reset();
    primaryAddressForm.get('address.community').reset();
    primaryAddressForm.get('address.stateProvince').reset();
    primaryAddressForm.get('address.postalCode').reset();

    return primaryAddressForm;
  }

  public clearMailingAddressFields(primaryAddressForm: FormGroup): FormGroup {
    primaryAddressForm.get('mailingAddress.addressLine1').reset();
    primaryAddressForm.get('mailingAddress.addressLine2').reset();
    primaryAddressForm.get('mailingAddress.community').reset();
    primaryAddressForm.get('mailingAddress.stateProvince').reset();
    primaryAddressForm.get('mailingAddress.postalCode').reset();

    return primaryAddressForm;
  }

  public setDefaultPrimaryAddressValues(
    primaryAddressForm: FormGroup,
    event: MatRadioChange
  ): FormGroup {
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
    primaryAddressForm: FormGroup,
    event: MatRadioChange
  ): FormGroup {
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

  public updateOnVisibility(primaryAddressForm: FormGroup): FormGroup {
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
}
