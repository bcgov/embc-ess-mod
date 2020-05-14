import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
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
    @Output() referralToRemove = new EventEmitter<number>();

    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef) { }

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
        this.onChanges();
    }

    createRowForm() {
        return this.builder.group({
            supportProvided: [''],
            description: [''],
            gst: [''],
            amount: ['']
        })
    }

    onChanges() {
        this.referralForm.get('referralRows').valueChanges.subscribe(formrow =>{
            let gstSum = formrow.reduce((prev, next) => prev + +next.gst, 0);
            let amtSum = formrow.reduce((prev, next) => prev + +next.amount, 0);
            this.referralForm.get('totalGst').setValue(gstSum);
            this.referralForm.get('totalAmount').setValue(amtSum);
        });
    }

    deleteRow(rowIndex: number) {
        this.referralRows.removeAt(rowIndex);
    }

    addRow() {
        this.referralRows.push(this.createRowForm());
        this.cd.detectChanges();
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