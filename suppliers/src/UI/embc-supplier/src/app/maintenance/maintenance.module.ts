import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceComponent } from './maintenance.component';
import { MaintenanceRoutingModule } from '../maintenance/maintenance-routing.module';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    MaintenanceRoutingModule
  ],
  declarations: [
    MaintenanceComponent
  ]
})
export class MaintenanceModule { }
