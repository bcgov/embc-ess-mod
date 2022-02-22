import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamMemberManagementRoutingModule } from './team-member-management-routing.module';
import { TeamMemberManagementComponent } from './team-member-management.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [TeamMemberManagementComponent],
  imports: [CommonModule, TeamMemberManagementRoutingModule, MaterialModule]
})
export class TeamMemberManagementModule {}
