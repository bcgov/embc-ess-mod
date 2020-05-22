import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    supplierForm: FormGroup;
    isReload: boolean = false;
    constructor(private builder: FormBuilder) {}

    createFormWithData(supplierForm: any, storedSupplierDetails: any) {
        this.isReload = true;
        this.supplierForm = supplierForm
       // this.setGroupValues(storedSupplierDetails);
        storedSupplierDetails.invoices.forEach(invoice => {
            this.invoices.push(this.createInvoiceFormArrayWithValues(invoice));
        });
        return this.supplierForm;
    }

    get invoices() {
        return this.supplierForm.get('invoices') as FormArray;
    }

    get receipts() {
        return this.supplierForm.get('receipts') as FormArray;
    }

    get referrals() {
        return this.invoices.controls['referrals'] as FormArray;
    }

    createInvoiceFormArrayWithValues(invoice: any) {
        return this.builder.group({
            invoiceNumber: [invoice.invoiceNumber, Validators.required],
            invoiceDate: [invoice.invoiceDate, Validators.required],
            invoiceAttachments: this.builder.array([]),
            referralList: [invoice.referralList, Validators.required],
            referrals: this.builder.array([
            ]),
            invoiceTotalGst: [invoice.invoiceTotalGst],
            invoiceTotalAmount: [invoice.invoiceTotalAmount]
        })
    }

    setGroupValues(storedSupplierDetails: any, supplierForm: any) {
        this.supplierForm.get('address.address1').setValue(storedSupplierDetails.address.address1);
        this.supplierForm.get('address.address2').setValue(storedSupplierDetails.address.address2);
        this.supplierForm.get('address.city').setValue(storedSupplierDetails.address.city);
        this.supplierForm.get('address.postalCode').setValue(storedSupplierDetails.address.postalCode);
        this.supplierForm.get('contactPerson').setValue(storedSupplierDetails.contactPerson);
        this.supplierForm.get('supplierBC').setValue(storedSupplierDetails.supplierBC);
        this.supplierForm.get('supplierLegalName').setValue(storedSupplierDetails.supplierLegalName);
        this.supplierForm.get('supplierName').setValue(storedSupplierDetails.supplierName);
        this.supplierForm.get('supplierSubmissionType').setValue(storedSupplierDetails.supplierSubmissionType);
        this.supplierForm.get('businessCountry').setValue(storedSupplierDetails.businessCountry);
        this.supplierForm.get('businessName').setValue(storedSupplierDetails.businessName);
        this.supplierForm.get('gstNumber').setValue(storedSupplierDetails.gstNumber);
        this.supplierForm.get('location').setValue(storedSupplierDetails.location);
    }

    clearStorage() {
    }
   
}