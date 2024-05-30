import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseholdMembersRoutingModule } from './household-members-routing.module';
import { HouseholdMembersComponent } from './household-members.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, HouseholdMembersRoutingModule, ReactiveFormsModule, HouseholdMembersComponent],
  exports: [HouseholdMembersComponent]
})
export class HouseholdMembersModule {}
