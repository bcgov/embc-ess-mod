import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeProfileDashboardRoutingModule } from './evacuee-profile-dashboard-routing.module';
import { EvacueeProfileDashboardComponent } from './evacuee-profile-dashboard.component';


@NgModule({
  declarations: [EvacueeProfileDashboardComponent],
  imports: [
    CommonModule,
    EvacueeProfileDashboardRoutingModule
  ]
})
export class EvacueeProfileDashboardModule { }
