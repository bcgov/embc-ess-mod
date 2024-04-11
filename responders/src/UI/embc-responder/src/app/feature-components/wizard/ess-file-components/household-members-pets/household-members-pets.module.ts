import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseholdMembersPetsRoutingModule } from './household-members-pets-routing.module';
import { HouseholdMembersPetsComponent } from './household-members-pets.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AnimalsModule } from '../animals/animals.module';
import { HouseholdMembersModule } from '../household-members/household-members.module';

@NgModule({
  declarations: [HouseholdMembersPetsComponent],
  imports: [
    CommonModule,
    HouseholdMembersPetsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HouseholdMembersModule,
    AnimalsModule
  ]
})
export class HouseholdMembersPetsModule {}
