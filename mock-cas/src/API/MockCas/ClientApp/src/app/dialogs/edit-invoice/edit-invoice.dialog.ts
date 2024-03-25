import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
import { SetPaymentRequest } from "../../core/api/models";
import { InvoicesService } from "../../core/api/services";

@Component({
    selector: 'edit-invoice.dialog',
    templateUrl: 'edit-invoice.dialog.html',
    styleUrls: ['./edit-invoice.dialog.scss']
})
export class EditInvoiceDialog implements OnInit {
    invoiceForm: FormGroup;
    invoiceNumber: string;
    saving: boolean = false;
    showErrorMessage: boolean = false;
    constructor(public dialogRef: MatDialogRef<EditInvoiceDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private invoiceService: InvoicesService,
        @Inject(MAT_DATE_FORMATS) private dateFormats: any
    ) {
        this.invoiceNumber = data.invoiceNumber;
        this.dateFormats.display.dateInput = "DD-MMM-yyyy";
    }

    ngOnInit(): void {
        let date = this.data.paymentDate ? new Date(this.data.paymentDate).toISOString() : '';
        this.invoiceForm = this.fb.group({
            paymentDate: [date, [Validators.required]],
            paymentStatus: [this.data.paymentStatus || 'NEGOTIABLE', [Validators.required]],
        });
    }

    save() {
        if (!this.invoiceForm.valid) {
            this.showErrorMessage = true;
        }
        else {
            this.showErrorMessage = false;
            this.saving = true;
            const request: SetPaymentRequest = this.invoiceForm.getRawValue();
            request.paymentDate = moment(request.paymentDate).format('DD-MMM-YYYY');
            this.invoiceService.invoicesSetPaymentDate({ invoiceNumber: this.invoiceNumber, body: request }).subscribe({
                next: (res: number) => {
                    this.saving = false;
                    this.dialogRef.close("created");
                },
                error: (err: any) => {
                    this.saving = false;
                    console.log(err);
                }
            });
        }
    }

    close() {
        this.dialogRef.close();
    }
}