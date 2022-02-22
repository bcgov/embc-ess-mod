import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListSuppliersRoutingModule } from './suppliers-list-routing.module';
import { SuppliersListComponent } from './suppliers-list.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SuppliersTableComponent } from './suppliers-table/suppliers-table.component';

@NgModule({
  declarations: [SuppliersListComponent, SuppliersTableComponent],
  imports: [
    CommonModule,
    ListSuppliersRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class SuppliersListModule {}
