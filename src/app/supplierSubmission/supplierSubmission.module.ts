import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierSubmissionComponent } from './supplierSubmission.component'
import { SupplierRoutingModule } from './supplier-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule
  ],
  declarations: [
    SupplierSubmissionComponent,
    ],
  exports: [
    ]
})
export class SupplierSubmissionModule { }