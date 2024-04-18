import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EvacuationDetailsComponent } from './evacuation-details.component';
import { MatCardModule } from '@angular/material/card';
import { EvacuationDetailsRoutingModule } from './evacuation-details-routing.module';
import { ReviewModule } from '../../../../feature-components/review/review.module';
import { ReferralDetailsComponent } from '../referral-details/referral-details.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    EvacuationDetailsRoutingModule,
    ReviewModule,
    MatCardModule,
    MatExpansionModule,
    MatTableModule,
    EvacuationDetailsComponent,
    ReferralDetailsComponent
  ],
  providers: [DatePipe]
})
export class EvacuationDetailsModule {}
