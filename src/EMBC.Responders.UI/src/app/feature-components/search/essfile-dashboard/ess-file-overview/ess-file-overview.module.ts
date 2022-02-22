import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileOverviewRoutingModule } from './ess-file-overview-routing.module';
import { EssFileOverviewComponent } from './ess-file-overview.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [EssFileOverviewComponent],
  imports: [CommonModule, EssFileOverviewRoutingModule, MaterialModule]
})
export class EssFileOverviewModule {}
