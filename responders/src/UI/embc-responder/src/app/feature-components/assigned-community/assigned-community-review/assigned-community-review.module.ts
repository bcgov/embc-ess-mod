import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedCommunityReviewRoutingModule } from './assigned-community-review-routing.module';
import { AssignedCommunityReviewComponent } from './assigned-community-review.component';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [
    AssignedCommunityReviewComponent
  ],
  imports: [
    CommonModule,
    AssignedCommunityReviewRoutingModule,
    MaterialModule
  ]
})
export class AssignedCommunityReviewModule { }
