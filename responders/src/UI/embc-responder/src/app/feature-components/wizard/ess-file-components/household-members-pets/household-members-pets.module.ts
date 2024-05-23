import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseholdMembersPetsRoutingModule } from './household-members-pets-routing.module';
import { HouseholdMembersPetsComponent } from './household-members-pets.component';

import { ReactiveFormsModule } from '@angular/forms';

import { AnimalsModule } from '../animals/animals.module';
import { HouseholdMembersModule } from '../household-members/household-members.module';

@NgModule({
  imports: [
    CommonModule,
    HouseholdMembersPetsRoutingModule,
    ReactiveFormsModule,
    HouseholdMembersModule,
    AnimalsModule,
    HouseholdMembersPetsComponent
  ]
})
export class HouseholdMembersPetsModule {}
