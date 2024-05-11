import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { NewSupplierRoutingModule } from './new-supplier-routing.module';
import { NewSupplierComponent } from './new-supplier.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NewSupplierComponent],
  imports: [CommonModule, NewSupplierRoutingModule, MaterialModule, ReactiveFormsModule, SharedModule, IMaskModule]
})
export class NewSupplierModule {}
