import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit{

    @Input('formGroupName') formGroupName: number;
    @Input('receiptForm') receiptForm: FormGroup;
    @Input('index') index: number;
    @Output() indexToRemove = new EventEmitter<number>();
    component: string = "R";

    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.addReferralTemplate();
        this.onChanges();
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
             referralDate : [''],
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

}