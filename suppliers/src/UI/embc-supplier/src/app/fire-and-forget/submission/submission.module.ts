import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { ReferralComponent } from './referral/referral.component';
import { SupplierRoutingModule } from './submission-routing.module';
import { SubmissionComponent } from './submission.component';

@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SubmissionComponent,
    InvoiceComponent,
    ReferralComponent,
    ReceiptComponent
  ]
})
export class SubmissionModule {}
