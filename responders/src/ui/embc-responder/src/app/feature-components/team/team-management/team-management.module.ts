import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamManagementRoutingModule } from './team-management-routing.module';
import { TeamManagementComponent } from './team-management.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    TeamManagementComponent
  ],
  imports: [
    CommonModule,
    TeamManagementRoutingModule,
    MaterialModule
  ]
})
export class TeamManagementModule { }
