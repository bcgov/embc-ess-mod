import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponderDashboardRoutingModule } from './responder-dashboard-routing.module';
import { ResponderDashboardComponent } from './responder-dashboard.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [ResponderDashboardComponent],
  imports: [CommonModule, ResponderDashboardRoutingModule, MaterialModule]
})
export class ResponderDashboardModule {}
