import { Component, Input, ChangeDetectorRef, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import {  DateParserService } from 'src/app/service/dateParser.service';
import { CustomDateAdapterService } from 'src/app/service/customDateAdapter.service';
import { SupplierService } from 'src/app/service/supplier.service';
import * as globalConst from 'src/app/service/globalConstants'
import { CustomValidationService } from 'src/app/service/customValidation.service';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    providers: [
        {provide: NgbDateAdapter, useClass: CustomDateAdapterService},
        {provide: NgbDateParserFormatter, useClass: DateParserService},
        CustomValidationService
    ]
})
export class InvoiceComponent implements OnInit{

    @Input('formGroupName') formGroupName: number;
    @Input('invoiceForm') invoiceForm: FormGroup;
    @Input('index') index: number;
    @Output() indexToRemove = new EventEmitter<number>();
    referralList = globalConst.referralList;
    component: string = "I";
    reloadedFiles: any;
    hidden = false;

    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, 
        private supplierService: SupplierService, private customValidator : CustomValidationService) {
       
    }

    get invoiceControl(){
        return this.invoiceForm.controls;
    }

    createAttachmentObject(data: any) {
        return this.builder.group(data);//, {validator: [this.customValidator.attachmentSizeValidator] }
    }

    ngOnInit() {
        this.onChanges();
        if(this.supplierService.isReload){
            this.loadWithExistingValues();
        } 
    }

    get invoiceAttachments() {
        return this.invoiceForm.get('invoiceAttachments') as FormArray;
    }

    loadWithExistingValues() {
        let storedSupplierDetails = this.supplierService.getSupplierDetails();
        this.reloadedFiles = storedSupplierDetails.invoices[this.index].invoiceAttachments;
        storedSupplierDetails.invoices[this.index].invoiceAttachments.forEach(element => {
            this.invoiceAttachments.push(this.createAttachmentObject({
                fileName: element.fileName,
                file: element.file
            }))
        });
        let referralList = storedSupplierDetails.invoices[this.index].referrals;
        if(referralList.length > 0) {
            this.hidden = true;
        }
        referralList.forEach(referral => {
                this.referrals.push(this.createReferralFormArrayWithValues(referral));
            });
        this.cd.detectChanges();
    }

    setFileFormControl(event: any) {
        const reader = new FileReader();
        reader.readAsDataURL(event);
        reader.onload = () => {
            this.invoiceAttachments.push(this.createAttachmentObject({
                fileName: event.name,
                file: reader.result,
                contentType: event.type,
               // fileSize: event.size
            }))
        }
        this.cd.markForCheck();
    }

    onChanges() {
        this.invoiceForm.get('referrals').valueChanges.subscribe(template =>{
            let totalGst = template.reduce((prev, next) => prev + +next.totalGst, 0);
            this.invoiceForm.get('invoiceTotalGst').setValue(totalGst);
            let totalAmount = template.reduce((prev, next) => prev + +next.totalAmount, 0);
            this.invoiceForm.get('invoiceTotalAmount').setValue(totalAmount);
        });
    }

    deleteFileFormControl(event: any) {
        this.invoiceAttachments.removeAt(event);
    }

    get referrals() {
        return this.invoiceForm.get('referrals') as FormArray;
    }

    createReferralFormArray() {
        return this.builder.group({
            referralNumber: ['', [Validators.required, this.customValidator.referralNumberValidator(this.referrals).bind(this.customValidator)]],
            referralRows: this.builder.array([
            ], Validators.required),
            totalGst: [''],
            totalAmount: [''],
            referralAttachments: this.builder.array([], [Validators.required]),
            receiptAttachments: this.builder.array([])
        })
    }

    injectTemplateReferral() {
        this.referrals.push(this.createReferralFormArray());
        this.cd.detectChanges();
    }

    addReferralTemplate(templateNo: number) {
        if(templateNo !== undefined && templateNo !== 0) {
            this.hidden = !this.hidden;
        }
        for (let i = 0; i < templateNo; i++) {
            this.injectTemplateReferral();
        }
    }

    addSingleReferralTemplate() {
        this.injectTemplateReferral();
    }

    cleanReferrals() {
        this.referrals.clear()
    }

    removeReferral(event: any) {
        this.referrals.removeAt(event);
    }

    
    createReferralFormArrayWithValues(referral: any) {
        return this.builder.group({
            referralNumber: [referral.referralNumber, Validators.required],
            referralRows: this.builder.array([
            ],Validators.required),
            totalGst: [referral.totalGst],
            totalAmount: [referral.totalAmount],
            referralAttachments: this.builder.array([], [Validators.required]),
            receiptAttachments: this.builder.array([])
        })
    }

    checkAttachmentLength(control: []) {
        return (control.length > 0);
    }

//     sizeCheck() {
//         console.log(this.invoiceAttachments.controls)
//     }
 }
