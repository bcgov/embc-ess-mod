import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { EvacuationFileListRoutingModule } from '../evacuation-file/evacuation-file-list/evacuation-file-list-routing.module';
import { ProfileRoutingModule } from '../evacuation-file/profile/profile-routing.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    EvacuationFileListRoutingModule,
    ProfileRoutingModule,
    MatCardModule,
    MatTabsModule,
    CoreModule
  ]
})
export class DashboardModule {}
