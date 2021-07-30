import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListSuppliersRoutingModule } from './list-suppliers-routing.module';
import { ListSuppliersComponent } from './list-suppliers.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [ListSuppliersComponent],
  imports: [CommonModule, ListSuppliersRoutingModule, MaterialModule]
})
export class ListSuppliersModule {}
