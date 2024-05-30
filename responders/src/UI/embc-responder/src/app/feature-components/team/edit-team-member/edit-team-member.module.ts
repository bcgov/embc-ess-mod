import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditTeamMemberRoutingModule } from './edit-team-member-routing.module';
import { EditTeamMemberComponent } from './edit-team-member.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, EditTeamMemberRoutingModule, EditTeamMemberComponent]
})
export class EditTeamMemberModule {}
