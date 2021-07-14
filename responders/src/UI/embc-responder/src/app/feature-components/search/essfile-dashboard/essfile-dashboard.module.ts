import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssfileDashboardRoutingModule } from './essfile-dashboard-routing.module';
import { EssfileDashboardComponent } from './essfile-dashboard.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EssfileDashboardComponent],
  imports: [
    CommonModule,
    EssfileDashboardRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class EssfileDashboardModule {}
