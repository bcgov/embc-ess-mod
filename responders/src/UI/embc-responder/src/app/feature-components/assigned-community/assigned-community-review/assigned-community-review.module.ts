import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedCommunityReviewRoutingModule } from './assigned-community-review-routing.module';
import { AssignedCommunityReviewComponent } from './assigned-community-review.component';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [AssignedCommunityReviewComponent],
  imports: [
    CommonModule,
    AssignedCommunityReviewRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class AssignedCommunityReviewModule {}
