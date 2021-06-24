import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssfileDashboardRoutingModule } from './essfile-dashboard-routing.module';
import { EssfileDashboardComponent } from './essfile-dashboard.component';

@NgModule({
  declarations: [EssfileDashboardComponent],
  imports: [CommonModule, EssfileDashboardRoutingModule]
})
export class EssfileDashboardModule {}
