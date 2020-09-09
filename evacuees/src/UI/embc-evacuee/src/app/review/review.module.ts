import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewRoutingModule } from './review-routing.module';
import { ReviewComponent } from './review.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
// import { EvacueeProfileFormsModule } from '../core/components/evacuee-profile-forms.module';

@NgModule({
  declarations: [
    ReviewComponent
  ],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    MatCardModule,
    MatButtonModule,
    // EvacueeProfileFormsModule
  ]
})
export class ReviewModule { }
