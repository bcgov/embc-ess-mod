import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierDetailRoutingModule } from './supplier-detail-routing.module';
import { SupplierDetailComponent } from './supplier-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SupplierDetailComponent],
  imports: [
    CommonModule,
    SupplierDetailRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    CustomPipeModule
  ]
})
export class SupplierDetailModule {}
