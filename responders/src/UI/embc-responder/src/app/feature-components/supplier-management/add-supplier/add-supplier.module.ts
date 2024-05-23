import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSupplierRoutingModule } from './add-supplier-routing.module';
import { AddSupplierComponent } from './add-supplier.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, AddSupplierRoutingModule, ReactiveFormsModule, AddSupplierComponent]
})
export class AddSupplierModule {}
