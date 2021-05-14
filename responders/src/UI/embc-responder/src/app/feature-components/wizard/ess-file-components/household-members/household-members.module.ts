import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseholdMembersRoutingModule } from './household-members-routing.module';
import { HouseholdMembersComponent } from './household-members.component';

@NgModule({
  declarations: [HouseholdMembersComponent],
  imports: [CommonModule, HouseholdMembersRoutingModule]
})
export class HouseholdMembersModule {}
