import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewSupportsRoutingModule } from './view-supports-routing.module';
import { ViewSupportsComponent } from './view-supports.component';

@NgModule({
  declarations: [ViewSupportsComponent],
  imports: [CommonModule, ViewSupportsRoutingModule]
})
export class ViewSupportsModule {}
