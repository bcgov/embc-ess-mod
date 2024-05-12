import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewSupportsRoutingModule } from './view-supports-routing.module';
import { ViewSupportsComponent } from './view-supports.component';
import { MaterialModule } from 'src/app/material.module';
import { SupportsTableComponent } from './supports-table/supports-table.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, ViewSupportsRoutingModule, MaterialModule, SharedModule, ViewSupportsComponent, SupportsTableComponent]
})
export class ViewSupportsModule {}
