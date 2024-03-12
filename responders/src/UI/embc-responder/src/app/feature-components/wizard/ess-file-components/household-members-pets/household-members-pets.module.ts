import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseholdMembersPetsRoutingModule } from './household-members-pets-routing.module';
import { HouseholdMembersPetsComponent } from './household-members-pets.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HouseholdMembersComponent } from '../household-members/household-members.component';
import { AnimalsComponent } from '../animals/animals.component';

@NgModule({
  declarations: [HouseholdMembersPetsComponent, HouseholdMembersComponent, AnimalsComponent],
  imports: [
    CommonModule,
    HouseholdMembersPetsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class HouseholdMembersPetsModule {}
