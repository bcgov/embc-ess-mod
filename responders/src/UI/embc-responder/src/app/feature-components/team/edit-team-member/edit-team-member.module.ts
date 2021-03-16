import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditTeamMemberRoutingModule } from './edit-team-member-routing.module';
import { EditTeamMemberComponent } from './edit-team-member.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [EditTeamMemberComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditTeamMemberRoutingModule,
    MaterialModule
  ]
})
export class EditTeamMemberModule { }
