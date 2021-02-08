import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewAuthProfileRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ReviewModule } from '../review/review.module';
import { EvacuationCardComponent } from '../evacuation-card/evacuation-card.component';
import { EvacuationDetailsComponent } from '../evacuation-details/evacuation-details.component';
import { ReferralDetailsComponent } from '../referral-details/referral-details.component';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    DashboardComponent,
    EvacuationCardComponent,
    EvacuationDetailsComponent,
    ReferralDetailsComponent
  ],
  imports: [
    CommonModule,
    ViewAuthProfileRoutingModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatTabsModule,
    ReviewModule,
    MatExpansionModule
  ]
})
export class ViewAuthProfileModule { }
