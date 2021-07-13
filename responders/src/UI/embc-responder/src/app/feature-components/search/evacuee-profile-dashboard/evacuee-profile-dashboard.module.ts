import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeProfileDashboardRoutingModule } from './evacuee-profile-dashboard-routing.module';
import { EvacueeProfileDashboardComponent } from './evacuee-profile-dashboard.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatchedEssfilesComponent } from './matched-essfiles/matched-essfiles.component';
import { PossibleMatchedEssfilesComponent } from './possible-matched-essfiles/possible-matched-essfiles.component';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

@NgModule({
  declarations: [
    EvacueeProfileDashboardComponent,
    MatchedEssfilesComponent,
    PossibleMatchedEssfilesComponent
  ],
  imports: [
    CommonModule,
    EvacueeProfileDashboardRoutingModule,
    MaterialModule,
    SharedModule,
    CustomPipeModule
  ]
})
export class EvacueeProfileDashboardModule {}
