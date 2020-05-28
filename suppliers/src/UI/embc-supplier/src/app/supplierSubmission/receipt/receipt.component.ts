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
    reloadedFiles: any;
    reloadedFiles2: any;

    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef, private supplierService: SupplierService) {}

    ngOnInit() {
        if(this.supplierService.isReload){
            this.loadWithExistingValues();
        } else {
            this.addReferralTemplate();
        }
        this.onChanges();
    }

    loadWithExistingValues() {
        let storedSupplierDetails = this.supplierService.getSupplierDetails();
        let referralList = storedSupplierDetails.receipts[this.index].referrals;

        this.reloadedFiles = storedSupplierDetails.receipts[this.index].referralAttachments;
        this.reloadedFiles.forEach(element => {
            this.referralAttachments.push(this.createAttachmentObject({
                fileName: element.fileName,
                file: element.file
            }))
        });
        this.reloadedFiles2 = storedSupplierDetails.receipts[this.index].receiptAttachments;
        this.reloadedFiles2.forEach(element => {
            this.receiptAttachments.push(this.createAttachmentObject({
                fileName: element.fileName,
                file: element.file
            }))
        });

        referralList.forEach(rec => {
                this.referrals.push(this.createReferralFormArrayWithValues(rec));
            });
        this.cd.detectChanges();
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
                file: reader.result,
                contentType: event.type
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
                file: reader.result,
                contentType: event.type
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
             receiptNumber: [referral.receiptNumber],
             referralRows: this.builder.array([
            ]),
            totalGst: [referral.totalGst],
            totalAmount: [referral.totalAmount]
         })
    }

    checkAttachmentLength(control: []) {
        return (control.length > 0);
    }

}