import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponderDashboardRoutingModule } from './responder-dashboard-routing.module';
import { ResponderDashboardComponent } from './responder-dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [ResponderDashboardComponent],
  imports: [CommonModule, ResponderDashboardRoutingModule, MaterialModule]
})
export class ResponderDashboardModule {}
