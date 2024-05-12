import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierManagementRoutingModule } from './supplier-management-routing.module';
import { SupplierManagementComponent } from './supplier-management.component';

@NgModule({
  imports: [CommonModule, SupplierManagementRoutingModule, SupplierManagementComponent]
})
export class SupplierManagementModule {}
