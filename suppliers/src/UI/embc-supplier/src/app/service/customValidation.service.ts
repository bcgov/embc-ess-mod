import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { SupplierService } from './supplier.service';

@Injectable()
export class CustomValidationService {

    constructor(private supplierService: SupplierService) { }

    invoiceValidator(invoices: any): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const currentContrrol = control.value;
            let check = '';
            if (invoices.value.length > 0 && currentContrrol !== '') {
                check = invoices.value.some(invoice => invoice.invoiceNumber.toLocaleLowerCase() === currentContrrol.toLocaleLowerCase());
                if (check) {
                    return { duplicateInvoice: true };
                }
            }
            return null;
        };
    }

    referralNumberValidator(referrals: any): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const currentContrrol = control.value;
            let check = '';
            if (referrals.value.length > 0 && currentContrrol !== '') {
                check = referrals.value.some(referral => referral.referralNumber.toLocaleLowerCase() === currentContrrol.toLocaleLowerCase());
                if (check) {
                    return { duplicateReferral: true };
                }
            }
            return null;
        };
    }

    attachmentSizeValidator(control: AbstractControl) {
        console.log(control);
            // if (control.value.fileSize == 0) {
            //     console.log(control.value.fileSize)
            //     return { zeroSize: true };
            // }
        return null;
        }


}


