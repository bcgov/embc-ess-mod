import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewAuthProfileRoutingModule } from './view-auth-profile-routing.module';
import { ViewAuthProfileComponent } from './view-auth-profile.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ReviewModule } from '../../components/review/review.module';
import { EvacuationCardComponent } from '../../components/evacuation-card/evacuation-card.component';
import { EvacuationDetailsComponent } from './../evacuation-details/evacuation-details.component';
import { DialogModule } from '../../../core/components/dialog/dialog.module';



@NgModule({
  declarations: [
    ViewAuthProfileComponent,
    EvacuationCardComponent,
    EvacuationDetailsComponent
  ],
  imports: [
    CommonModule,
    ViewAuthProfileRoutingModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatTabsModule,
    ReviewModule,
    DialogModule
  ]
})
export class ViewAuthProfileModule { }
