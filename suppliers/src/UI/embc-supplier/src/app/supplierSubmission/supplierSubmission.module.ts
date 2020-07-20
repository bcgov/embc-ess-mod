import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierSubmissionComponent } from './supplierSubmission.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReferralComponent } from './referral/referral.component';
import { CoreModule } from '../core/core.module';
import { ReceiptComponent } from './receipt/receipt.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../core/components/modal/modal.component';

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
  // entryComponents: [
  //   ModalComponent
  //   ]
})
export class SupplierSubmissionModule { }
