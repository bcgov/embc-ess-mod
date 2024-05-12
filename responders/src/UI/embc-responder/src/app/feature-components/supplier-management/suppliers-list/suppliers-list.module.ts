import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListSuppliersRoutingModule } from './suppliers-list-routing.module';
import { SuppliersListComponent } from './suppliers-list.component';

import { SuppliersTableComponent } from './suppliers-table/suppliers-table.component';

@NgModule({
  imports: [CommonModule, ListSuppliersRoutingModule, SuppliersListComponent, SuppliersTableComponent]
})
export class SuppliersListModule {}
