import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutageComponent } from './outage.component';
import { OutageRoutingModule } from './outage-routing.module';

@NgModule({
  declarations: [OutageComponent],
  imports: [CommonModule, OutageRoutingModule]
})
export class OutageModule {}
