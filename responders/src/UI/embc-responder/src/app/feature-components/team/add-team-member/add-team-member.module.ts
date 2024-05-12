import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AddTeamMemberRoutingModule } from './add-team-member-routing.module';
import { AddTeamMemberComponent } from './add-team-member.component';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [CommonModule, AddTeamMemberRoutingModule, ReactiveFormsModule, MaterialModule, SharedModule, AddTeamMemberComponent]
})
export class AddTeamMemberModule {}
