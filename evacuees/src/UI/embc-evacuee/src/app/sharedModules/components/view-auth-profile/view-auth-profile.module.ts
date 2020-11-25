import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewAuthProfileRoutingModule } from './view-auth-profile-routing.module';
import { ViewAuthProfileComponent } from './view-auth-profile.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ReviewModule } from '../../components/review/review.module';

@NgModule({
  declarations: [ViewAuthProfileComponent],
  imports: [
    CommonModule,
    ViewAuthProfileRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    ReviewModule
  ]
})
export class ViewAuthProfileModule { }
