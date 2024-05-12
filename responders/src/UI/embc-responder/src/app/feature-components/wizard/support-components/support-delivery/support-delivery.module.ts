import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { SupportDeliveryRoutingModule } from './support-delivery-routing.module';
import { SupportDeliveryComponent } from './support-delivery.component';

import { BilletingDeliveryComponent } from './delivery-types/billeting-delivery/billeting-delivery.component';
import { ShelterAllowanceDeliveryComponent } from './delivery-types/shelter-allowance-delivery/shelter-allowance-delivery.component';
import { GroupLodgingDeliveryComponent } from './delivery-types/group-lodging-delivery/group-lodging-delivery.component';
import { SupportReferralComponent } from './support-referral/support-referral.component';
import { SupportEtransferComponent } from './support-etransfer/support-etransfer.component';

@NgModule({
  imports: [
    CommonModule,
    SupportDeliveryRoutingModule,
    ReactiveFormsModule,
    IMaskModule,
    SupportDeliveryComponent,
    BilletingDeliveryComponent,
    ShelterAllowanceDeliveryComponent,
    GroupLodgingDeliveryComponent,
    SupportReferralComponent,
    SupportEtransferComponent
  ]
})
export class SupportDeliveryModule {}
