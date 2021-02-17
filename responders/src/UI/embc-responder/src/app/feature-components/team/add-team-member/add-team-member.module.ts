import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddTeamMemberRoutingModule } from './add-team-member-routing.module';
import { AddTeamMemberComponent } from './add-team-member.component';

@NgModule({
  declarations: [
    AddTeamMemberComponent
  ],
  imports: [
    CommonModule,
    AddTeamMemberRoutingModule
  ]
})
export class AddTeamMemberModule { }
