import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { NewSupplierRoutingModule } from './new-supplier-routing.module';
import { NewSupplierComponent } from './new-supplier.component';

@NgModule({
  imports: [CommonModule, NewSupplierRoutingModule, ReactiveFormsModule, IMaskModule, NewSupplierComponent]
})
export class NewSupplierModule {}
