import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportDeliveryRoutingModule } from './support-delivery-routing.module';
import { SupportDeliveryComponent } from './support-delivery.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { BilletingDeliveryComponent } from './delivery-types/billeting-delivery/billeting-delivery.component';
import { GroupLodgingDeliveryComponent } from './delivery-types/group-lodging-delivery/group-lodging-delivery.component';

@NgModule({
  declarations: [
    SupportDeliveryComponent,
    BilletingDeliveryComponent,
    GroupLodgingDeliveryComponent
  ],
  imports: [
    CommonModule,
    SupportDeliveryRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomPipeModule,
    SharedModule,
    TextMaskModule
  ]
})
export class SupportDeliveryModule {}
