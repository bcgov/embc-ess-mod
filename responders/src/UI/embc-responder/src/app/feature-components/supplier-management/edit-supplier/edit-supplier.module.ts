import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { EditSupplierRoutingModule } from './edit-supplier-routing.module';
import { EditSupplierComponent } from './edit-supplier.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EditSupplierComponent],
  imports: [CommonModule, EditSupplierRoutingModule, MaterialModule, ReactiveFormsModule, SharedModule, IMaskModule]
})
export class EditSupplierModule {}
