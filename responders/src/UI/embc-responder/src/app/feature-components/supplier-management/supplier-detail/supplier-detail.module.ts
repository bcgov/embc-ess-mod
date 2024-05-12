import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierDetailRoutingModule } from './supplier-detail-routing.module';
import { SupplierDetailComponent } from './supplier-detail.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SupplierDetailRoutingModule, ReactiveFormsModule, SupplierDetailComponent]
})
export class SupplierDetailModule {}
