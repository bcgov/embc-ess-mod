import { AbstractControl, ValidatorFn, FormArray, FormGroup } from '@angular/forms';
import { Injectable, Predicate } from '@angular/core';
import { SupplierService } from './supplier.service';

@Injectable()
export class CustomValidationService {

    constructor(private supplierService: SupplierService) { }

    /**
     * Validation for the invoice number to be always unique
     * @param invoices Invoice Array
     */
    invoiceValidator(invoices: FormArray): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const currentContrrol = control.value;
            let check = '';
            if (invoices.value.length > 0 && currentContrrol !== '') {
                check = invoices.value.some(invoice => invoice.invoiceNumber.toLocaleLowerCase() ===
                    currentContrrol.toLocaleLowerCase());
                if (check) {
                    return { duplicateInvoice: true };
                }
            }
            return null;
        };
    }

    /**
     * Validation for the referral number to be always unique
     * @param referrals Referrals Array
     */
    referralNumberValidator(referrals: FormArray): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const currentContrrol = control.value;
            let check = '';
            if (referrals.value.length > 0 && currentContrrol !== '') {
                check = referrals.value.some(referral => referral.referralNumber.toLocaleLowerCase() ===
                    currentContrrol.toLocaleLowerCase());
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
     * Validation for amount to be always greater than GST
     */
    amountGreaterValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.parent) {
                const gst = control.get('gst').value;
                const amount = control.get('amount').value;
                if (gst !== '' && amount !== '') {
                    if (gst > amount) {
                        return { amountGreater: true };
                    }
                }
            }
            return null;
        };
    }

    /**
     * Validition for the fields that are conditional
     * @param predicate : condition to check
     * @param validator : validtor to test again
     * @param errorName : custom error name
     */
    conditionalValidation(predicate: () => boolean, validator: ValidatorFn, errorName?: string) {
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

}


