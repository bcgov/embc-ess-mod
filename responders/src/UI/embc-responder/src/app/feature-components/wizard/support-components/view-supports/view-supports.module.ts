import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewSupportsRoutingModule } from './view-supports-routing.module';
import { ViewSupportsComponent } from './view-supports.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [ViewSupportsComponent],
  imports: [CommonModule, ViewSupportsRoutingModule, MaterialModule]
})
export class ViewSupportsModule {}
