import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierManagementRoutingModule } from './supplier-management-routing.module';
import { SupplierManagementComponent } from './supplier-management.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
    imports: [CommonModule, SupplierManagementRoutingModule, MaterialModule, SupplierManagementComponent]
})
export class SupplierManagementModule {}
