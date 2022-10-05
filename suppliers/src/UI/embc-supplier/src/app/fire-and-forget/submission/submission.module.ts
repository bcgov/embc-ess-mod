import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SubmissionComponent } from './submission.component';
import { SupplierRoutingModule } from './submission-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReferralComponent } from './referral/referral.component';
import { CoreModule } from '../../core/core.module';
import { ReceiptComponent } from './receipt/receipt.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../core/components/modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    NgbModule
  ],
  declarations: [
    SubmissionComponent,
    InvoiceComponent,
    ReferralComponent,
    ReceiptComponent
  ]
})
export class SubmissionModule {}
