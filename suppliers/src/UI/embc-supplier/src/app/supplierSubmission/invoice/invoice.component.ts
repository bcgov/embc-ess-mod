import { Component, Input, ChangeDetectorRef, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import {  DateParserService } from 'src/app/service/dateParser.service';
import { CustomDateAdapterService } from 'src/app/service/customDateAdapter.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    providers: [
        {provide: NgbDateAdapter, useClass: CustomDateAdapterService},
        {provide: NgbDateParserFormatter, useClass: DateParserService}
    ]
})
export class InvoiceComponent implements OnInit{

    @Input('formGroupName') formGroupName: number;
    @Input('invoiceForm') invoiceForm: FormGroup;
    @Input('index') index: number;
    @Output() indexToRemove = new EventEmitter<number>();
    referralList: any = ['1', '2', '3', '4', '5'];
    component: string = "I";
    rowArr: any = [];
    @Input() refArray: any;

    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, private supplierService: SupplierService) {
       
    }

    get invoiceControl(){
        return this.invoiceForm.controls;
    }

    createAttachmentObject(data: any) {
        return this.builder.group(data);
    }

    ngOnInit() {
        this.onChanges();
        if(this.refArray) {
            console.log(this.refArray);
           for(let i=0; i< this.refArray.length; i++) {
                let val = this.refArray[i];
                for(let j =0; j< val.length; j++) {
                    this.referrals.push(this.createReferralFormArrayWithValues(val[j]));
                    this.rowArr.push(val[j].referralRows);
                }
               
            };
            this.cd.detectChanges();
        }
    }

    get invoiceAttachments() {
        return this.invoiceForm.get('invoiceAttachments') as FormArray;
    }

    setFileFormControl(event: any) {
        const reader = new FileReader();
        reader.readAsDataURL(event);
        reader.onload = () => {
            this.invoiceAttachments.push(this.createAttachmentObject({
                fileName: event.name,
                file: reader.result
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
            referralNumber: ['', Validators.required],
            referralRows: this.builder.array([
            ]),
            totalGst: [''],
            totalAmount: [''],
            referralAttachments: this.builder.array([]),
            receiptAttachments: this.builder.array([])
        })
    }

    injectTemplateReferral() {
        this.referrals.push(this.createReferralFormArray());
        this.cd.detectChanges();
    }

    addReferralTemplate(templateNo: number) {
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
            ]),
            totalGst: [referral.totalGst],
            totalAmount: [referral.totalAmount],
            referralAttachments: this.builder.array([]),
            receiptAttachments: this.builder.array([])
        })
    }



}
