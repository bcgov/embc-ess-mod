import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamMemberReviewRoutingModule } from './team-member-review-routing.module';
import { TeamMemberReviewComponent } from './team-member-review.component';

@NgModule({
  imports: [CommonModule, TeamMemberReviewRoutingModule, TeamMemberReviewComponent]
})
export class TeamMemberReviewModule {}
