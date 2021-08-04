import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierDetailRoutingModule } from './supplier-detail-routing.module';
import { SupplierDetailComponent } from './supplier-detail.component';


@NgModule({
  declarations: [
    SupplierDetailComponent
  ],
  imports: [
    CommonModule,
    SupplierDetailRoutingModule
  ]
})
export class SupplierDetailModule { }
