import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { NgbDateParserFormatter, NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DateParserService } from 'src/app/service/dateParser.service';
import { SupplierService } from 'src/app/service/supplier.service';
import { CustomDateAdapterService } from 'src/app/service/customDateAdapter.service';
import { CustomValidationService } from 'src/app/service/customValidation.service';

@Component({
    selector: 'app-referral',
    templateUrl: './referral.component.html',
    styleUrls: ['./referral.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomDateAdapterService },
        { provide: NgbDateParserFormatter, useClass: DateParserService }
    ]
})
export class ReferralComponent implements OnInit {

    @Input() formGroupName: number;
    @Input() referralForm: FormGroup;
    @Input() index: number;
    @Input() component: string;
    @Output() referralToRemove = new EventEmitter<number>();
    @Input() invoiceCurrentIndex: number;
    @Input() formArraySize: number;
    supportList: any;
    reloadedFiles: any;
    reloadedFiles2: any;

    constructor(private builder: FormBuilder, private cd: ChangeDetectorRef, private ngbCalendar: NgbCalendar,
                private dateAdapter: NgbDateAdapter<string>, private supplierService: SupplierService,
                private customValidator: CustomValidationService) { }

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

    get rowControl() {
        return (this.referralForm.controls.referralRows as FormArray).controls;
    }

    ngOnInit() {
        this.supportList = this.supplierService.getSupportItems();
        if (this.component === 'R' && this.referralForm !== null) {
            this.referralForm.get('receiptNumber').setValue(String(this.index + 1));
        }
        if (this.supplierService.isReload) {
            this.loadWithExistingValues();
        } else {
            this.referralRows.push(this.createRowForm());
        }
        this.onChanges();
    }
    loadWithExistingValues() {
        const storedSupplierDetails = this.supplierService.getSupplierDetails();
        if (this.component === 'I') {
            const rowList = storedSupplierDetails.invoices[this.invoiceCurrentIndex].referrals[this.index].referralRows;
            this.reloadedFiles = storedSupplierDetails.invoices[this.invoiceCurrentIndex].referrals[this.index].referralAttachments;
            this.reloadedFiles.forEach(element => {
                this.referralAttachments.push(this.createAttachmentObject({
                    fileName: element.fileName,
                    file: element.file
                }));
            });
            this.reloadedFiles2 = storedSupplierDetails.invoices[this.invoiceCurrentIndex].referrals[this.index].receiptAttachments;
            this.reloadedFiles2.forEach(element => {
                this.receiptAttachments.push(this.createAttachmentObject({
                    fileName: element.fileName,
                    file: element.file
                }));
            });
            rowList.forEach(row => {
                this.referralRows.push(this.createRowFormWithValues(row));
            });
        } else if (this.component === 'R') {
            const rowList = storedSupplierDetails.receipts[this.invoiceCurrentIndex].referrals[this.index].referralRows;
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
        }, {validator: this.customValidator.amountGreaterValidator().bind(this.customValidator)});
    }

    onChanges() {
        this.referralForm.get('referralRows').valueChanges.subscribe(formrow => {
            const gstSum = formrow.reduce((prev, next) => prev + +next.gst, 0);
            const amtSum = formrow.reduce((prev, next) => prev + +next.amount, 0);
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
                file: reader.result,
                contentType: event.type
            }));
        };
        // this.cd.markForCheck();
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

    createRowFormWithValues(row: any) {
        return this.builder.group({
            supportProvided: [row.supportProvided],
            description: [row.description],
            gst: [row.gst],
            amount: [row.amount]
        },
        {validator: this.customValidator.amountGreaterValidator().bind(this.customValidator)});
    }

    checkAttachmentLength(control: []) {
        return (control.length > 0);
    }

}
