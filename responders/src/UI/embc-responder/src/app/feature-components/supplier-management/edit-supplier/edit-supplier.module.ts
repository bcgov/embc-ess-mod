import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { EditSupplierRoutingModule } from './edit-supplier-routing.module';
import { EditSupplierComponent } from './edit-supplier.component';

@NgModule({
  imports: [CommonModule, EditSupplierRoutingModule, ReactiveFormsModule, IMaskModule, EditSupplierComponent]
})
export class EditSupplierModule {}
