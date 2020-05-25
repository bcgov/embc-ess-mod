import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SupplierService } from '../service/supplier.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Province } from '../model/province';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceModalContent } from '../core/components/modal/invoiceModal.component';
import { ReceiptModalContent } from '../core/components/modal/receiptModal.component';
import { Country } from '../model/country';
import * as globalConst from 'src/app/service/globalConstants';

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
    countryList: Country[];
    stateList: Province[];
    provinceList: Province[];
    selectedRemitCountry: string;
    locatedInBC: string;
    postalPattern = "^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$";
    defaultProvince = { code: 'BC', name: 'British Columbia' };
    defaultCountry = { code: 'CAN', name: 'Canada' };

    ngOnInit() {
        this.initializeForm();
        this.repopulateFormData();
        this.countryList = this.supplierService.getCountryListt();
        this.supplierService.isReload = false;
    }

    searchCity = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            switchMap(term => this.supplierService.getCityList().pipe(
                map(resp => resp.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
            )
        );

    cityFormatter = (x: { name: string }) => x.name;

    searchState = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            switchMap(term => this.supplierService.getStateList().pipe(
                map(resp => resp.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
            )
        );

    stateFormatter = (x: { name: string }) => x.name;

    searchProvince = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            switchMap(term => this.supplierService.getProvinceList().pipe(
                map(resp => resp.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
            )
        );

    provinceFormatter = (x: { name: string }) => x.name;

    repopulateFormData() {
        let storedSupplierDetails = this.supplierService.getSupplierDetails();
        if (storedSupplierDetails) {
            this.initializeForm();
            this.mapFormValues(storedSupplierDetails);
        }
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
                fax: [''],
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
            //this.supplierForm.get('businessName').setValidators(Validators.required);
            // this.supplierForm.get('businessCountry').setValidators(Validators.required);
            // this.supplierForm.get('remittanceAddress.address1').setValidators(Validators.required);
            // this.supplierForm.get('remittanceAddress.city').setValidators(Validators.required);
        } else {
            console.log("inside else")
            //this.supplierForm.get('businessName').clearValidators();
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
        console.log(selectedValue)
        this.selectedRemitCountry = selectedValue;
        if (selectedValue === 'Canada') {
            // this.supplierForm.get('remittanceAddress.state').setValidators(null);
            // this.supplierForm.get('remittanceAddress.province').setValidators(Validators.required);
            // this.supplierForm.get('remittanceAddress.postalCode').setValidators([Validators.required, Validators.pattern(this.postalPattern)]);
            // this.supplierForm.get('remittanceAddress.zipCode').setValidators(null);
            // this.supplierForm.get('remittanceAddress.otherCode').setValidators(null);
            this.addressDiv = false;
        } else {
            // this.supplierForm.get('remittanceAddress.state').setValidators(Validators.required);
            // this.supplierForm.get('remittanceAddress.province').setValidators(null);
            // this.supplierForm.get('remittanceAddress.postalCode').setValidators(null);
            // this.supplierForm.get('remittanceAddress.zipCode').setValidators(Validators.required);
            // this.supplierForm.get('remittanceAddress.otherCode').setValidators(null);
            this.addressDiv = true;
        }
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

    refArray: any = [];

    mapFormValues(storedSupplierDetails: any) {
        this.supplierService.isReload = true;
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
        let submissionType = this.supplierForm.get('supplierSubmissionType')
        this.loadWithExistingValues(submissionType);
    }

    loadWithExistingValues(event: any) {
        let storedSupplierDetails = this.supplierService.getSupplierDetails();
        if (event.value === 'invoice') {
            storedSupplierDetails.invoices.forEach(invoice => {
                this.invoices.push(this.createInvoiceFormArrayWithValues(invoice));
            });
        } else if (event.value === 'receipt') {
            storedSupplierDetails.receipts.forEach(rec => {
                this.receipts.push(this.createReceiptFormArrayWithValues(rec));
            });
        }
        this.cd.detectChanges();
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

    createReceiptFormArrayWithValues(receipt: any) {
        return this.builder.group({
            referralNumber: [receipt.referralNumber, Validators.required],
            referrals: this.builder.array([
            ]),
            receiptTotalGst: [receipt.referralNumber],
            receiptTotalAmount: [receipt.referralNumber],
            referralAttachments: this.builder.array([]),
            receiptAttachments: this.builder.array([])
        })
    }

}