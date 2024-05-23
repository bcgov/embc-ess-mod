import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExistingSupportDetailsRoutingModule } from './existing-support-details-routing.module';
import { ExistingSupportDetailsComponent } from './existing-support-details.component';

@NgModule({
  imports: [CommonModule, ExistingSupportDetailsRoutingModule, ExistingSupportDetailsComponent]
})
export class ExistingSupportDetailsModule {}
