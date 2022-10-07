import {
  AbstractControl,
  ValidatorFn,
  UntypedFormArray,
  FormGroup
} from '@angular/forms';
import { Injectable, Predicate } from '@angular/core';
import { SupplierService } from './supplier.service';
import { formatDate } from '@angular/common';

@Injectable()
export class CustomValidationService {
  constructor(private supplierService: SupplierService) {}

  /**
   * Validation for the invoice number to be always unique
   *
   * @param invoices Invoice Array
   */
  invoiceValidator(invoices: UntypedFormArray): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const currentContrrol = control.value;
      let check = '';
      if (invoices.value.length > 0 && currentContrrol !== '') {
        check = invoices.value.some(
          (invoice) =>
            invoice.invoiceNumber.toLocaleLowerCase() ===
            currentContrrol.toLocaleLowerCase()
        );
        if (check) {
          return { duplicateInvoice: true };
        }
      }
      return null;
    };
  }

  /**
   * Validation for the referral number to be always unique
   *
   * @param referrals Referrals Array
   */
  referralNumberValidator(referrals: UntypedFormArray): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const currentContrrol = control.value;
      let check = '';
      if (referrals.value.length > 0 && currentContrrol !== '') {
        check = referrals.value.some(
          (referral) =>
            referral.referralNumber.toLocaleLowerCase() ===
            currentContrrol.toLocaleLowerCase()
        );
        if (check) {
          return { duplicateReferral: true };
        }
      }
      return null;
    };
  }

  attachmentSizeValidator(control: AbstractControl) {
    if (control.value.fileSize === 0) {
      return { zeroSize: true };
    }
    return null;
  }

  /**
   * Validition for the fields that are conditional
   *
   * @param predicate : condition to check
   * @param validator : validtor to test again
   * @param errorName : custom error name
   */
  conditionalValidation(
    predicate: () => boolean,
    validator: ValidatorFn,
    errorName?: string
  ) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.parent) {
        let validationError = null;
        if (predicate()) {
          validationError = validator(control);
        }

        if (errorName && validationError) {
          const customError = {};
          customError[errorName] = validationError;
          validationError = customError;
        }

        return validationError;
      }
      return null;
    };
  }

  /**
   * Validation for date to be always be in the past
   */
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        if (Date.parse(control.value) > Date.parse(new Date().toISOString())) {
          return { futureDate: true };
        }
      }
      return null;
    };
  }

  /**
   * Validation to avoid white spaces only as input
   */
  whitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined) {
        if ((control.value || '').trim().length === 0) {
          return { whitespaceError: true };
        }
      }
    };
  }
}
