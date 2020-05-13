import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-referral',
    templateUrl: './referral.component.html',
    styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {

    @Input() formGroupName: number;
    @Input() referralForm: FormGroup
    @Input() index: number;
    @Input() component: string;
    supportList: any = ['Food - Groceries', 'Food - Restaurant Meals', 'Lodging - Hotel', 'Lodging - Group Lodging', 'Lodging - Billeting', 'Transportation - Taxi', 'Transportation - Other', 'Clothing', 'Incidentals'];

    constructor(private builder: FormBuilder) { }

    get referralRows() {
        return this.referralForm.get('referralRows') as FormArray;
    }

    get referralAttachments() {
        return this.referralForm.get('referralAttachments') as FormArray;
    }

    get receiptAttachments() {
        return this.referralForm.get('receiptAttachments') as FormArray;
    }

    ngOnInit() {
        this.referralRows.push(this.createRowForm());
    }

    createRowForm() {
        return this.builder.group({
            supportProvided: [''],
            description: [''],
            gst: [''],
            amount: ['']
        })
    }

    deleteRow(rowIndex: number) {
        this.referralRows.removeAt(rowIndex);
    }

    addRow() {
        this.referralRows.push(this.createRowForm());
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

}