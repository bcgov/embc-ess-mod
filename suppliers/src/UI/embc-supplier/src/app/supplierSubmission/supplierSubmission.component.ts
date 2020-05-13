import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, Type, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SupplierService } from '../service/supplier.service';

@Component({
    selector: 'supplier-submission',
    templateUrl: './supplierSubmission.component.html',
    styleUrls: ['./supplierSubmission.component.scss']
})
export class SupplierSubmissionComponent implements OnInit {

    constructor(private router: Router, private builder: FormBuilder, private supplierService: SupplierService, private componentFactory: ComponentFactoryResolver, 
        private injector: Injector, private cd: ChangeDetectorRef) { }

    supplierForm: FormGroup;

    ngOnInit() {
        this.initializeForm();
        let storedSupplierDetails = this.supplierService.getSupplierDetails();
        if (storedSupplierDetails) {
            this.supplierForm.setValue(storedSupplierDetails);
        }
    }

    initializeForm() {
        this. supplierForm = this.builder.group({
            supplierLegalName: [''],
            supplierName: [''],
            location: [''],
            gstNumber: [''],
            remitToOtherBusiness: [''],
    
            address: this.builder.group({
                address1: [''],
                address2: [''],
                city: [''],
                province: ['British Columbia'],
                postalCode: [''],
                country: ['Canada'],
            }),
    
            contactPerson: this.builder.group({
                firstName: [''],
                lastName: [''],
                email: [''],
                phone: [''],
                fax: [''],
            }),
    
            supplierSubmissionType: [''],
            invoices: this.builder.array([
            ]),
            receipts: this.builder.array([
            ])
        });
    }

    get invoices() {
        return this.supplierForm.get('invoices') as FormArray;
    }

    get receipts() {
        return this.supplierForm.get('receipts') as FormArray;
    }

    createInvoiceFormArray() {
        return this.builder.group({
            invoiceNumber: [''],
            invoiceDate: [''],
            invoiceAttachments: this.builder.array([]),
            referralList: [''],
            referrals: this.builder.array([          
            ]),
            invoiceTotalGst: [''],
            invoiceTotalAmount: ['']
        }) 
    }

    createReceiptFormArray() {
        return this.builder.group({
            referralNumber: [''],
            referrals: this.builder.array([          
            ]),
            receiptTotalGst: [''],
            receiptTotalAmount: [''],
            referralAttachments: this.builder.array([]),
            receiptAttachments: this.builder.array([])
        })
    }

    onSubmit() {
        console.log(this.supplierForm.value)
        let supplierDetails = this.supplierForm.value;
        this.supplierService.setSupplierDetails(supplierDetails);
        this.router.navigate(['/review']);
    }

    onValueChange(event: any) {
        if(event.target.value === 'invoice') {
            this.cleanReceiptTemplate();
            this.injectInvoiceTemplate();
        } else if(event.target.value === 'receipt') {
            this.cleanInvoiceTemplate();
            this.injectReceiptTemplate();
        }
    }

    injectInvoiceTemplate() {
        this.invoices.push(this.createInvoiceFormArray());
        this.cd.detectChanges();

    }

    injectReceiptTemplate() {
        this.receipts.push(this.createReceiptFormArray());
        this.cd.detectChanges();
    }

    addInvoiceTemplate() {
        this.injectInvoiceTemplate();
    }

    addReceiptTemplate() {
        this.injectReceiptTemplate();
    }

    cleanInvoiceTemplate() {
        this.invoices.clear();
    }

    cleanReceiptTemplate() {
        this.receipts.clear();
    }

    deleteInvoice(event: any) {
        this.invoices.removeAt(event);
    }

    deleteReceipt(event: any) {
        this.receipts.removeAt(event);
    }


}