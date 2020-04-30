import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierSubmissionComponent } from './supplierSubmission.component'
import { SupplierRoutingModule } from './supplier-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    SupplierSubmissionComponent,
    ],
  exports: [
    ]
})
export class SupplierSubmissionModule { }