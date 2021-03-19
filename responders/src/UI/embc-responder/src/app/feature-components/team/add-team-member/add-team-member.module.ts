import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AddTeamMemberRoutingModule } from './add-team-member-routing.module';
import { AddTeamMemberComponent } from './add-team-member.component';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [
    AddTeamMemberComponent
  ],
  imports: [
    CommonModule,
    AddTeamMemberRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class AddTeamMemberModule { }
