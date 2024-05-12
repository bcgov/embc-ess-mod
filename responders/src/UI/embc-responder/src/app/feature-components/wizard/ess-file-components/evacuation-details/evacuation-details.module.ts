import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacuationDetailsRoutingModule } from './evacuation-details-routing.module';
import { EvacuationDetailsComponent } from './evacuation-details.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, EvacuationDetailsRoutingModule, ReactiveFormsModule, EvacuationDetailsComponent]
})
export class EvacuationDetailsModule {}
