import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSupplierRoutingModule } from './add-supplier-routing.module';
import { AddSupplierComponent } from './add-supplier.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, AddSupplierRoutingModule, MaterialModule, ReactiveFormsModule, SharedModule, AddSupplierComponent]
})
export class AddSupplierModule {}
