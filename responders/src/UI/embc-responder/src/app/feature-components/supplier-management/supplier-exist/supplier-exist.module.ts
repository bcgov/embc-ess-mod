import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierExistRoutingModule } from './supplier-exist-routing.module';
import { SupplierExistComponent } from './supplier-exist.component';

@NgModule({
  imports: [CommonModule, SupplierExistRoutingModule, SupplierExistComponent]
})
export class SupplierExistModule {}
