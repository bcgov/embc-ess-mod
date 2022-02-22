import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditTeamMemberRoutingModule } from './edit-team-member-routing.module';
import { EditTeamMemberComponent } from './edit-team-member.component';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [EditTeamMemberComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditTeamMemberRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class EditTeamMemberModule {}
