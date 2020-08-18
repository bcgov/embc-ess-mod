import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SupplierService } from 'src/app/service/supplier.service';
import * as globalConst from 'src/app/service/globalConstants';
import { CustomValidationService } from 'src/app/service/customValidation.service';

@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.scss'],

})
export class ReceiptComponent implements OnInit{

    @Input() formGroupName: number;
    @Input() receiptForm: FormGroup;
    @Input() index: number;
    @Input() formArraySize: number;
    @Output() indexToRemove = new EventEmitter<number>();
    component = 'R';
    reloadedFiles: any;
    reloadedFiles2: any;
    noOfAttachments: number = 1;

    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef, 
        private supplierService: SupplierService, private customValidator: CustomValidationService) {}

    ngOnInit() {
        if (this.supplierService.isReload){
            this.loadWithExistingValues();
        } else {
            this.addReferralTemplate();
        }
        this.onChanges();
    }

    /**
     * Loads data for back/forward navigation
     */
    loadWithExistingValues() {
        const storedSupplierDetails = this.supplierService.getSupplierDetails();
        const referralList = storedSupplierDetails.receipts[this.index].referrals;

        this.reloadedFiles = storedSupplierDetails.receipts[this.index].referralAttachments;
        this.reloadedFiles.forEach(element => {
            this.referralAttachments.push(this.createAttachmentObject({
                fileName: element.fileName,
                file: element.file
            }));
        });
        this.reloadedFiles2 = storedSupplierDetails.receipts[this.index].receiptAttachments;
        this.reloadedFiles2.forEach(element => {
            this.receiptAttachments.push(this.createAttachmentObject({
                fileName: element.fileName,
                file: element.file
            }));
        });

        referralList.forEach(rec => {
                this.referrals.push(this.createReferralFormArrayWithValues(rec));
            });
        this.cd.detectChanges();
    }

    /**
     * Gets receipts form control
     */
    get receiptControl(){
        return this.receiptForm.controls;
    }

    /**
     * Gets referrals as form array
     */
    get referrals() {
        return this.receiptForm.get('referrals') as FormArray;
    }

    /**
     * Gets referral attachments as form array
     */
    get referralAttachments() {
        return this.receiptForm.get('referralAttachments') as FormArray;
    }

    /**
     * Gets receipt attachments as form array
     */
    get receiptAttachments() {
        return this.receiptForm.get('receiptAttachments') as FormArray;
    }

    /**
     *  Creates Referral form array
     */
    createReferralFormArray() {
        return this.builder.group({
             referralDate : ['', [Validators.required, this.customValidator.futureDateValidator().bind(this.customValidator)]],
             receiptNumber: [''],
             referralRows: this.builder.array([
            ], Validators.required),
            totalGst: [''],
            totalAmount: ['']
         });
    }

    onChanges() {
        this.receiptForm.get('referrals').valueChanges.subscribe(template => {
            const totalGst = template.reduce((prev, next) => prev + +next.totalGst, 0).toFixed(2);
            this.receiptForm.get('receiptTotalGst').setValue(totalGst);
            const totalAmount = template.reduce((prev, next) => prev + +next.totalAmount, 0).toFixed(2);
            this.receiptForm.get('receiptTotalAmount').setValue(totalAmount);
        });
    }

     /**
     * Injects referral tempate to the view
     */
    injectTemplateReferral() {
        this.referrals.push(this.createReferralFormArray());
        this.cd.detectChanges();
    }

    /**
     * Adds referral to the referral form array
     */
    addReferralTemplate() {
        this.injectTemplateReferral();
    }

    addSingleReferralTemplate() {
        this.injectTemplateReferral();
    }

    /**
     * Reads the attachment content and encodes it as base64
     * @param event : Attachment drop/browse event
     */
    setReferralFormControl(event: any) {
        const reader = new FileReader();
        reader.readAsDataURL(event);
        reader.onload = () => {
            this.referralAttachments.push(this.createAttachmentObject({
                fileName: event.name,
                file: reader.result,
                contentType: event.type
            }));
        };
        // this.cd.markForCheck();
    }

    /**
     * Deletes attachments
     * @param event : Output event for delete
     */
    deleteReferralFormControl(event: any) {
        this.referralAttachments.removeAt(event);
    }

    /**
     * Reads the attachment content and encodes it as base64
     * @param event : Attachment drop/browse event
     */
    setReceiptFormControl(event: any) {
        const reader = new FileReader();
        reader.readAsDataURL(event);
        reader.onload = () => {
            this.receiptAttachments.push(this.createAttachmentObject({
                fileName: event.name,
                file: reader.result,
                contentType: event.type
            }));
        };
        // this.cd.markForCheck();
    }

    deleteReceiptFormControl(event: any) {
        this.receiptAttachments.removeAt(event);
    }

    createAttachmentObject(data: any) {
        return this.builder.group(data);
    }

    /**
     * Open confirmation modal to delete referral from the form array
     * @param event : Output event for delete
     */
    removeReferral(event: any) {
        this.supplierService.confirmModal(globalConst.deleteReceiptsMsg, globalConst.deleteReceiptButton).subscribe((e) => {
            if (e) {
                this.referrals.removeAt(event);
            }
        });
    }

    /**
     * Populates existing referral form enteries to the array
     * @param referral :Existing referral enteries
     */
    createReferralFormArrayWithValues(referral: any) {
        return this.builder.group({
             referralDate : [referral.referralDate, [Validators.required, this.customValidator.futureDateValidator().bind(this.customValidator)]],
             receiptNumber: [referral.receiptNumber],
             referralRows: this.builder.array([
            ], Validators.required),
            totalGst: [referral.totalGst],
            totalAmount: [referral.totalAmount]
         });
    }

    checkAttachmentLength(control: []) {
        return (control.length > 0);
    }

}
