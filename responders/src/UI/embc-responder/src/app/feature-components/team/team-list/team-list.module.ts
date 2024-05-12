import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamListRoutingModule } from './team-list-routing.module';
import { TeamListComponent } from './team-list.component';

import { TeamMemberTableComponent } from './team-member-table/team-member-table.component';

@NgModule({
  imports: [CommonModule, TeamListRoutingModule, TeamListComponent, TeamMemberTableComponent]
})
export class TeamListModule {}
