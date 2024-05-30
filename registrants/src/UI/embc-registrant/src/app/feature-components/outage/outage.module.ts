import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutageRoutingModule } from './outage-routing.module';
import { OutageComponent } from './outage.component';

@NgModule({
  imports: [CommonModule, OutageRoutingModule, OutageComponent]
})
export class OutageModule {}
