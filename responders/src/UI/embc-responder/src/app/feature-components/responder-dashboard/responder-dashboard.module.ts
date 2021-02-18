import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponderDashboardRoutingModule } from './responder-dashboard-routing.module';
import { ResponderDashboardComponent } from './responder-dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ResponderDashboardComponent
  ],
  imports: [
    CommonModule,
    ResponderDashboardRoutingModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class ResponderDashboardModule { }
