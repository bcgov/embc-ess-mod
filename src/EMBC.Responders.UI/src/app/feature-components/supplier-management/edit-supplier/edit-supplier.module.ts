import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditSupplierRoutingModule } from './edit-supplier-routing.module';
import { EditSupplierComponent } from './edit-supplier.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [EditSupplierComponent],
  imports: [
    CommonModule,
    EditSupplierRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    TextMaskModule
  ]
})
export class EditSupplierModule {}
