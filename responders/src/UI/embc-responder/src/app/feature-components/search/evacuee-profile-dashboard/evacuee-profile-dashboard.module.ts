import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeProfileDashboardRoutingModule } from './evacuee-profile-dashboard-routing.module';
import { EvacueeProfileDashboardComponent } from './evacuee-profile-dashboard.component';

import { MatchedEssfilesComponent } from './matched-essfiles/matched-essfiles.component';
import { PossibleMatchedEssfilesComponent } from './possible-matched-essfiles/possible-matched-essfiles.component';

@NgModule({
  imports: [
    CommonModule,
    EvacueeProfileDashboardRoutingModule,
    EvacueeProfileDashboardComponent,
    MatchedEssfilesComponent,
    PossibleMatchedEssfilesComponent
  ]
})
export class EvacueeProfileDashboardModule {}
