import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamListRoutingModule } from './team-list-routing.module';
import { TeamListComponent } from './team-list.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    TeamListComponent
  ],
  imports: [
    CommonModule,
    TeamListRoutingModule,
    SharedModule
  ]
})
export class TeamListModule { }
