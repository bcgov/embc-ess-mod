import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedCommunityReviewRoutingModule } from './assigned-community-review-routing.module';
import { AssignedCommunityReviewComponent } from './assigned-community-review.component';

@NgModule({
  imports: [CommonModule, AssignedCommunityReviewRoutingModule, AssignedCommunityReviewComponent]
})
export class AssignedCommunityReviewModule {}
