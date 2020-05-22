import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierSubmissionComponent } from './supplierSubmission.component'
import { SupplierRoutingModule } from './supplier-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReferralComponent } from './referral/referral.component';
import { CoreModule } from '../core/core.module';
import { ReceiptComponent } from './receipt/receipt.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceModalContent } from '../core/components/modal/invoiceModal.component';
import { ReceiptModalContent } from '../core/components/modal/receiptModal.component';

@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    NgbModule
  ],
  declarations: [
    SupplierSubmissionComponent,
    InvoiceComponent,
    ReferralComponent,
    ReceiptComponent
    ],
  entryComponents: [
    InvoiceModalContent,
    ReceiptModalContent
    ]
})
export class SupplierSubmissionModule { }