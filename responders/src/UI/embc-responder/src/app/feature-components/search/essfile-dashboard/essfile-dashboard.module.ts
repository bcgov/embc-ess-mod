import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssfileDashboardRoutingModule } from './essfile-dashboard-routing.module';
import { EssfileDashboardComponent } from './essfile-dashboard.component';

import { HouseholdMemberComponent } from './household-member/household-member.component';

@NgModule({
  imports: [CommonModule, EssfileDashboardRoutingModule, EssfileDashboardComponent, HouseholdMemberComponent]
})
export class EssfileDashboardModule {}
