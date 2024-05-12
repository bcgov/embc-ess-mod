import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamMemberReviewRoutingModule } from './team-member-review-routing.module';
import { TeamMemberReviewComponent } from './team-member-review.component';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [CommonModule, TeamMemberReviewRoutingModule, MaterialModule, SharedModule, TeamMemberReviewComponent]
})
export class TeamMemberReviewModule {}
