import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportDeliveryRoutingModule } from './support-delivery-routing.module';
import { SupportDeliveryComponent } from './support-delivery.component';

@NgModule({
  declarations: [SupportDeliveryComponent],
  imports: [CommonModule, SupportDeliveryRoutingModule]
})
export class SupportDeliveryModule {}
