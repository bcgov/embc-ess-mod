import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierExistRoutingModule } from './supplier-exist-routing.module';
import { SupplierExistComponent } from './supplier-exist.component';
import { MaterialModule } from 'src/app/material.module';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

@NgModule({
  declarations: [SupplierExistComponent],
  imports: [
    CommonModule,
    SupplierExistRoutingModule,
    MaterialModule,
    CustomPipeModule
  ]
})
export class SupplierExistModule {}
