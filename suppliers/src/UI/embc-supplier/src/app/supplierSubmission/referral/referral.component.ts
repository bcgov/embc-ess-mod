import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { NgbDateParserFormatter, NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DateParserService } from 'src/app/service/dateParser.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
    selector: 'app-referral',
    templateUrl: './referral.component.html',
    styleUrls: ['./referral.component.scss'],
    providers: [
        { provide: NgbDateParserFormatter, useClass: DateParserService }
    ]
})
export class ReferralComponent implements OnInit {

    @Input() formGroupName: number;
    @Input() referralForm: FormGroup
    @Input() index: number;
    @Input() component: string;
    supportList: any;
    @Output() referralToRemove = new EventEmitter<number>();
    @Input() invoiceCurrentIndex: number;


    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, private supplierService: SupplierService) { }

    get referralRows() {
        return this.referralForm.get('referralRows') as FormArray;
    }

    get referralAttachments() {
        return this.referralForm.get('referralAttachments') as FormArray;
    }

    get receiptAttachments() {
        return this.referralForm.get('receiptAttachments') as FormArray;
    }

    get referralControl() {
        return this.referralForm.controls;
    }

    ngOnInit() {
        this.supportList = this.supplierService.getSupportItems();
        if(this.component === 'R' && this.referralForm !== null) {
            this.referralForm.get('receiptNumber').setValue(this.index+1);
        }
        if (this.supplierService.isReload) {
            this.loadWithExistingValues();
            console.log("lastToLoad")
        } else {
            this.referralRows.push(this.createRowForm());
            this.onChanges();
        }
    }

    loadWithExistingValues() {
        let storedSupplierDetails = this.supplierService.getSupplierDetails();
        if (this.component === 'I') {
            let rowList = storedSupplierDetails.invoices[this.invoiceCurrentIndex].referrals[this.index].referralRows;
            rowList.forEach(row => {
                this.referralRows.push(this.createRowFormWithValues(row));
            });
        } else if (this.component === 'R') {
            let rowList = storedSupplierDetails.receipts[this.invoiceCurrentIndex].referrals[this.index].referralRows;
            rowList.forEach(row => {
                this.referralRows.push(this.createRowFormWithValues(row));
            });
        }
        this.cd.detectChanges();
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
        this.referralForm.get('referralRows').valueChanges.subscribe(formrow => {
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

    createRowFormWithValues(row: any) {
        return this.builder.group({
            supportProvided: [row.supportProvided],
            description: [row.description],
            gst: [row.gst],
            amount: [row.amount]
        })
    }

}