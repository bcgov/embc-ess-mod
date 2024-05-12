import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewSupportsRoutingModule } from './view-supports-routing.module';
import { ViewSupportsComponent } from './view-supports.component';

import { SupportsTableComponent } from './supports-table/supports-table.component';

@NgModule({
  imports: [CommonModule, ViewSupportsRoutingModule, ViewSupportsComponent, SupportsTableComponent]
})
export class ViewSupportsModule {}
