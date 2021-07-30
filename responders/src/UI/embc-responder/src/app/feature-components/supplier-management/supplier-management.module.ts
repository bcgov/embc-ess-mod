import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierManagementRoutingModule } from './supplier-management-routing.module';
import { SupplierManagementComponent } from './supplier-management.component';

@NgModule({
  declarations: [SupplierManagementComponent],
  imports: [CommonModule, SupplierManagementRoutingModule]
})
export class SupplierManagementModule {}
