import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssfileDashboardRoutingModule } from './essfile-dashboard-routing.module';
import { EssfileDashboardComponent } from './essfile-dashboard.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HouseholdMemberComponent } from './household-member/household-member.component';

@NgModule({
  declarations: [EssfileDashboardComponent, HouseholdMemberComponent],
  imports: [
    CommonModule,
    EssfileDashboardRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class EssfileDashboardModule {}
