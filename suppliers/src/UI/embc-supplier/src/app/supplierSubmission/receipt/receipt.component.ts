import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.scss'],
    
})
export class ReceiptComponent implements OnInit{

    @Input('formGroupName') formGroupName: number;
    @Input('receiptForm') receiptForm: FormGroup;
    @Input('index') index: number;
    @Output() indexToRemove = new EventEmitter<number>();
    component: string = "R";
    @Input() refArray: any;
    recArr: any = [];

    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef, private supplierService: SupplierService) {}

    ngOnInit() {
        if(this.refArray) {
            console.log(this.refArray);
           for(let i=0; i< this.refArray.length; i++) {
                let val = this.refArray[i];
                for(let j =0; j< val.length; j++) {
                    this.referrals.push(this.createReferralFormArrayWithValues(val[j]));
                    this.recArr.push(val[j].referralRows);
                }
               
            };
            this.cd.detectChanges();
        } else {
            this.addReferralTemplate();
        }
        this.onChanges();
    }

    get receiptControl(){
        return this.receiptForm.controls;
    }

    get referrals() {
        return this.receiptForm.get('referrals') as FormArray;
    }

    get referralAttachments() {
        return this.receiptForm.get('referralAttachments') as FormArray;
    }

    get receiptAttachments() {
        return this.receiptForm.get('receiptAttachments') as FormArray;
    }

    createReferralFormArray() {
        return this.builder.group({
             referralDate : ['', Validators.required],
             receiptNumber: [''],
             referralRows: this.builder.array([
            ]),
            totalGst: [''],
            totalAmount: ['']
         })
    }

    onChanges() {
        this.receiptForm.get('referrals').valueChanges.subscribe(template =>{
            let totalGst = template.reduce((prev, next) => prev + +next.totalGst, 0);
            this.receiptForm.get('receiptTotalGst').setValue(totalGst);
            let totalAmount = template.reduce((prev, next) => prev + +next.totalAmount, 0);
            this.receiptForm.get('receiptTotalAmount').setValue(totalAmount);
        });
    }

    injectTemplateReferral() {
        this.referrals.push(this.createReferralFormArray());
        this.cd.detectChanges();
    }

    addReferralTemplate() {
        this.injectTemplateReferral();
    }

    addSingleReferralTemplate() {
        this.injectTemplateReferral();
    }

    setReferralFormControl(event: any) {
        const reader = new FileReader();
        reader.readAsDataURL(event);
        reader.onload = () => {
            this.referralAttachments.push(this.createAttachmentObject({
                fileName: event.name,
                file: reader.result
            }))
        }
        //this.cd.markForCheck();
    }

    deleteReferralFormControl(event: any) {
        this.referralAttachments.removeAt(event);
    }

    setReceiptFormControl(event: any) {
        const reader = new FileReader();
        reader.readAsDataURL(event);
        reader.onload = () => {
            this.receiptAttachments.push(this.createAttachmentObject({
                fileName: event.name,
                file: reader.result
            }))
        }
        //this.cd.markForCheck();
    }

    deleteReceiptFormControl(event: any) {
        this.receiptAttachments.removeAt(event);
    }

    createAttachmentObject(data: any) {
        return this.builder.group(data);
    }

    removeReferral(event: any) {
        this.referrals.removeAt(event);
    }

    createReferralFormArrayWithValues(referral: any) {
        return this.builder.group({
             referralDate : [referral.referralDate, Validators.required],
             referralRows: this.builder.array([
            ]),
            totalGst: [referral.totalGst],
            totalAmount: [referral.totalAmount]
         })
    }

}