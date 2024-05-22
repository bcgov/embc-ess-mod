import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaintenanceRoutingModule } from '../maintenance/maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';

@NgModule({
  imports: [CommonModule, MaintenanceRoutingModule, MaintenanceComponent]
})
export class MaintenanceModule {}
