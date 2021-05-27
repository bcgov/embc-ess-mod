import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeProfileDashboardRoutingModule } from './evacuee-profile-dashboard-routing.module';
import { EvacueeProfileDashboardComponent } from './evacuee-profile-dashboard.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EvacueeProfileDashboardComponent],
  imports: [
    CommonModule,
    EvacueeProfileDashboardRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class EvacueeProfileDashboardModule {}
