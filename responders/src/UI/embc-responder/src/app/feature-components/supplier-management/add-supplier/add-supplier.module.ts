import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSupplierRoutingModule } from './add-supplier-routing.module';
import { AddSupplierComponent } from './add-supplier.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddSupplierComponent],
  imports: [
    CommonModule,
    AddSupplierRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AddSupplierModule {}
