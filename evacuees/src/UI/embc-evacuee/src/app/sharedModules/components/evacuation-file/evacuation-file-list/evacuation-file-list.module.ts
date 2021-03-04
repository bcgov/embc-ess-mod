import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvacuationFileListComponent } from './evacuation-file-list.component';
import { EvacuationFileListRoutingModule } from './evacuation-file-list-routing.module';
import { EvacuationCardComponent } from '../evacuation-card/evacuation-card.component';
import { EvacuationDetailsComponent } from '../evacuation-details/evacuation-details.component';
import { ReferralDetailsComponent } from '../referral-details/referral-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReviewModule } from '../../review/review.module';



@NgModule({
  declarations: [
    EvacuationFileListComponent,
    EvacuationCardComponent,
    EvacuationDetailsComponent,
    ReferralDetailsComponent],
  imports: [
    CommonModule,
    EvacuationFileListRoutingModule,
    ReviewModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule
  ]
})
export class EvacuationFileListModule { }
