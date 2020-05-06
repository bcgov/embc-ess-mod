import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierSubmissionComponent } from './supplierSubmission.component'
import { SupplierRoutingModule } from './supplier-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReferralComponent } from './referral/referral.component';

@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    SupplierSubmissionComponent,
    InvoiceComponent,
    ReferralComponent
    ],
  exports: [
    ]
})
export class SupplierSubmissionModule { }