import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamManagementRoutingModule } from './team-management-routing.module';
import { TeamManagementComponent } from './team-management.component';

@NgModule({
  declarations: [
    TeamManagementComponent
  ],
  imports: [
    CommonModule,
    TeamManagementRoutingModule
  ]
})
export class TeamManagementModule { }
