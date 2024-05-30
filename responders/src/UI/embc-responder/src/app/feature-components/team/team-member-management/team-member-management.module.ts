import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamMemberManagementRoutingModule } from './team-member-management-routing.module';
import { TeamMemberManagementComponent } from './team-member-management.component';

@NgModule({
  imports: [CommonModule, TeamMemberManagementRoutingModule, TeamMemberManagementComponent]
})
export class TeamMemberManagementModule {}
