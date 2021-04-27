import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamMemberDetailRoutingModule } from './team-member-detail-routing.module';
import { TeamMemberDetailComponent } from './team-member-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [TeamMemberDetailComponent],
  imports: [
    CommonModule,
    TeamMemberDetailRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class TeamMemberDetailModule {}
