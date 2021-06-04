import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseholdMembersRoutingModule } from './household-members-routing.module';
import { HouseholdMembersComponent } from './household-members.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [HouseholdMembersComponent],
  imports: [
    CommonModule,
    HouseholdMembersRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class HouseholdMembersModule {}
