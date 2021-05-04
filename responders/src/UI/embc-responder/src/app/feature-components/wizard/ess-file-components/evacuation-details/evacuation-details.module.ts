import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacuationDetailsRoutingModule } from './evacuation-details-routing.module';
import { EvacuationDetailsComponent } from './evacuation-details.component';

@NgModule({
  declarations: [EvacuationDetailsComponent],
  imports: [CommonModule, EvacuationDetailsRoutingModule]
})
export class EvacuationDetailsModule {}
