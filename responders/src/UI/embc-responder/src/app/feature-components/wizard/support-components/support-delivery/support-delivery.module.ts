import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportDeliveryRoutingModule } from './support-delivery-routing.module';
import { SupportDeliveryComponent } from './support-delivery.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SupportDeliveryComponent],
  imports: [
    CommonModule,
    SupportDeliveryRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomPipeModule,
    SharedModule
  ]
})
export class SupportDeliveryModule {}
