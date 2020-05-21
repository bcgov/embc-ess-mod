import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SupplierService } from '../service/supplier.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Community } from '../model/community';
import { Province } from '../model/province';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceModalContent } from '../core/components/modal/invoiceModal.component';
import { ReceiptModalContent } from '../core/components/modal/receiptModal.component';

@Component({
    selector: 'supplier-submission',
    templateUrl: './supplierSubmission.component.html',
    styleUrls: ['./supplierSubmission.component.scss']
})
export class SupplierSubmissionComponent implements OnInit {

    constructor(private router: Router, private builder: FormBuilder, private supplierService: SupplierService, private cd: ChangeDetectorRef, private modalService: NgbModal) { }

    supplierForm: FormGroup;
    remitDiv: boolean = false;
    addressDiv: boolean = false;
    countryList = ['Canada', 'United States', 'Any other country'];
    stateList = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado'];
    provinceList: Province[];
    cityList: Community[];
    selectedRemitCountry: string;
    locatedInBC: string;
    postalPattern = "^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$";
    defaultProvince = {code: 'BC', name: 'British Columbia'};
    defaultCountry = {code: 'CAN', name: 'Canada'};

    searchCity = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term === '' ? []
                : this.cityList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        );

    cityFormatter = (x: { name: string }) => x.name;

    searchState = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 1 ? []
                : this.stateList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        );

    searchProvince = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term === '' ? []
                : this.provinceList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        );

    provinceFormatter = (x: { name: string }) => x.name;

    ngOnInit() {
        this.initializeForm();
        let storedSupplierDetails = this.supplierService.getSupplierDetails();
        if (storedSupplierDetails) {
            this.supplierForm.setValue(storedSupplierDetails);
        }
        this.cityList = this.supplierService.getCityList();
        console.log(this.cityList);
        this.provinceList = this.supplierService.getProvinceList();
    }

    initializeForm() {
        this.supplierForm = this.builder.group({
            supplierLegalName: ['', Validators.required],
            supplierName: [''],
            location: [''],
            gstNumber: ['', [Validators.required]],
            remitToOtherBusiness: [''],
            businessName: [''],
            businessCountry: [''],
            supplierBC: [''],

            address: this.builder.group({
                address1: ['', Validators.required],
                address2: [''],
                city: ['', Validators.required],
                province: [this.defaultProvince.name],
                postalCode: ['', [Validators.required, Validators.pattern(this.postalPattern)]],
                country: [this.defaultCountry.name],
            }),

            contactPerson: this.builder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                email: ['', Validators.email],
                phone: ['', Validators.required],
                fax: ['', Validators.required],
            }),

            remittanceAddress: this.builder.group({
                address1: [''],
                address2: [''],
                city: [''],
                province: [''],
                state: [''],
                region: [''],
                postalCode: [''],
                zipCode: [''],
                otherCode: ['']
            }),

            supplierSubmissionType: [''],
            invoices: this.builder.array([
            ]),
            receipts: this.builder.array([
            ])
        });
    }

    get control() {
        return this.supplierForm.controls;
    }

    get invoices() {
        return this.supplierForm.get('invoices') as FormArray;
    }

    get receipts() {
        return this.supplierForm.get('receipts') as FormArray;
    }

    toggleVisibility(event: any) {
        this.remitDiv = event.target.checked;
        console.log(this.remitDiv)
        if (this.remitDiv) {
            console.log("inside if")
            this.supplierForm.get('businessName').setValidators(Validators.required);
            // this.supplierForm.get('businessCountry').setValidators(Validators.required);
            // this.supplierForm.get('remittanceAddress.address1').setValidators(Validators.required);
            // this.supplierForm.get('remittanceAddress.city').setValidators(Validators.required);
        } else {
            console.log("inside else")
            this.supplierForm.get('businessName').clearValidators();
            // this.supplierForm.get('businessCountry').setValidators(null);
            // this.supplierForm.get('remittanceAddress.address1').setValidators(null);
            // this.supplierForm.get('remittanceAddress.city').setValidators(null);
            // this.supplierForm.get('remittanceAddress.state').setValidators(null);
            // this.supplierForm.get('remittanceAddress.province').setValidators(null);
            // this.supplierForm.get('remittanceAddress.postalCode').setValidators(null);
            // this.supplierForm.get('remittanceAddress.zipCode').setValidators(null);
            // this.supplierForm.get('remittanceAddress.otherCode').setValidators(null);
        }
        //this.supplierForm.get('remittanceAddress').updateValueAndValidity();
    }

    remitVisibility(selectedValue: any) {
        this.selectedRemitCountry = selectedValue;
        // if (selectedValue === 'Canada' && selectedValue !== 'Country') {
        //     this.supplierForm.get('remittanceAddress.state').setValidators(null);
        //     this.supplierForm.get('remittanceAddress.province').setValidators(Validators.required);
        //     this.supplierForm.get('remittanceAddress.postalCode').setValidators([Validators.required, Validators.pattern(this.postalPattern)]);
        //     this.supplierForm.get('remittanceAddress.zipCode').setValidators(null);
        //     this.supplierForm.get('remittanceAddress.otherCode').setValidators(null);
        //     this.addressDiv = false;
        // } else if (selectedValue === 'United States' && selectedValue !== 'Country') {
        //     this.supplierForm.get('remittanceAddress.state').setValidators(Validators.required);
        //     this.supplierForm.get('remittanceAddress.province').setValidators(null);
        //     this.supplierForm.get('remittanceAddress.postalCode').setValidators(null);
        //     this.supplierForm.get('remittanceAddress.zipCode').setValidators(Validators.required);
        //     this.supplierForm.get('remittanceAddress.otherCode').setValidators(null);
        //     this.addressDiv = true
        // } else if(selectedValue !== 'Country') {
        //     this.supplierForm.get('remittanceAddress.state').setValidators(null);
        //     this.supplierForm.get('remittanceAddress.province').setValidators(null);
        //     this.supplierForm.get('remittanceAddress.postalCode').setValidators(null);
        //     this.supplierForm.get('remittanceAddress.zipCode').setValidators(null);
        //     this.supplierForm.get('remittanceAddress.otherCode').setValidators(Validators.required);
        // }
        //this.supplierForm.get('remittanceAddress').updateValueAndValidity();
    }

    locatedChange(event: any) {
        this.locatedInBC = event.target.value;
        this.addressDiv = true;
    }

    createInvoiceFormArray() {
        return this.builder.group({
            invoiceNumber: ['', Validators.required],
            invoiceDate: ['', Validators.required],
            invoiceAttachments: this.builder.array([]),
            referralList: ['', Validators.required],
            referrals: this.builder.array([
            ]),
            invoiceTotalGst: [''],
            invoiceTotalAmount: ['']
        })
    }

    createReceiptFormArray() {
        return this.builder.group({
            referralNumber: ['', Validators.required],
            referrals: this.builder.array([
            ]),
            receiptTotalGst: [''],
            receiptTotalAmount: [''],
            referralAttachments: this.builder.array([]),
            receiptAttachments: this.builder.array([])
        })
    }

    onSubmit() {
        this.supplierForm.get('address.province').setValue(this.defaultProvince);
        this.supplierForm.get('address.country').setValue(this.defaultCountry);
        let supplierDetails = this.supplierForm.value;
        this.supplierService.setSupplierDetails(supplierDetails);
        this.supplierService.createPayload(supplierDetails);
        this.router.navigate(['/review']);
    }

    onValueChange(event: any) {
        if (event.target.value === 'invoice') {
            if (this.receipts.length > 0) {
                const modalRef = this.modalService.open(InvoiceModalContent);
                modalRef.componentInstance.clearIndicator.subscribe((e) => {
                    if (e) {
                        this.cleanReceiptTemplate();
                        this.injectInvoiceTemplate();
                    } else {
                        this.supplierForm.get('supplierSubmissionType').setValue('receipt');
                    }
                });
            } else {
                this.injectInvoiceTemplate();
            }
        } else if (event.target.value === 'receipt') {
            if (this.invoices.length > 0) {
                const modalRef = this.modalService.open(ReceiptModalContent);
                modalRef.componentInstance.clearIndicator.subscribe((e) => {
                    if (e) {
                        this.cleanInvoiceTemplate();
                        this.injectReceiptTemplate();
                    } else {
                        this.supplierForm.get('supplierSubmissionType').setValue('invoice');
                    }
                });
            } else {
                this.injectReceiptTemplate();
            }
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
        this.receipts.setValidators(null);
        this.invoices.clear();
    }

    cleanReceiptTemplate() {
        this.receipts.setValidators(null);
        this.receipts.clear();
    }

    deleteInvoice(event: any) {
        this.invoices.removeAt(event);
    }

    deleteReceipt(event: any) {
        this.receipts.removeAt(event);
    }


}