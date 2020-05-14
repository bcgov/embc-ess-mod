import { Component, Input, ChangeDetectorRef, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit{

    @Input('formGroupName') formGroupName: number;
    @Input('invoiceForm') invoiceForm: FormGroup;
    @Input('index') index: number;
    @Output() indexToRemove = new EventEmitter<number>();
    referralList: any = ['1', '2', '3', '4', '5'];
    component: string = "I";

    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef) {
    }

    createAttachmentObject(data: any) {
        return this.builder.group(data);
    }

    ngOnInit() {
        this.onChanges();
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
            referralNumber: [''],
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

}
