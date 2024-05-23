import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutageComponent } from './outage.component';
import { OutageRoutingModule } from './outage-routing.module';

@NgModule({
  imports: [CommonModule, OutageRoutingModule, OutageComponent]
})
export class OutageModule {}
