import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamMemberDetailRoutingModule } from './team-member-detail-routing.module';
import { TeamMemberDetailComponent } from './team-member-detail.component';

@NgModule({
  imports: [CommonModule, TeamMemberDetailRoutingModule, TeamMemberDetailComponent]
})
export class TeamMemberDetailModule {}
