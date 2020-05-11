import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierSubmissionComponent } from './supplierSubmission.component'
import { SupplierRoutingModule } from './supplier-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReferralComponent } from './referral/referral.component';
import { CoreModule } from '../core/core.module';
import { ReceiptComponent } from './receipt/receipt.component';

@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    CoreModule
  ],
  declarations: [
    SupplierSubmissionComponent,
    InvoiceComponent,
    ReferralComponent,
    ReceiptComponent
    ],
  exports: [
    ]
})
export class SupplierSubmissionModule { }