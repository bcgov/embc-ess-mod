import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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

    constructor(private builder: FormBuilder) {}

    ngOnInit() {
        this.addReferralTemplate();
    }

    get referrals() {
        return this.receiptForm.get('referrals') as FormArray;
    }

    createReferralFormArray() {
        return this.builder.group({
             referralNumber : ['']
         })
    }

    injectTemplateReferral() {
        this.referrals.push(this.createReferralFormArray());
    }

    addReferralTemplate() {
        this.injectTemplateReferral();
    }

}