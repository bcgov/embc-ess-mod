import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileOverviewRoutingModule } from './ess-file-overview-routing.module';
import { EssFileOverviewComponent } from './ess-file-overview.component';

@NgModule({
  imports: [CommonModule, EssFileOverviewRoutingModule, EssFileOverviewComponent]
})
export class EssFileOverviewModule {}
