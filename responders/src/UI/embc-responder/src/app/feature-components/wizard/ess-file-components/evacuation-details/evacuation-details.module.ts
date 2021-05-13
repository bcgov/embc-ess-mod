import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacuationDetailsRoutingModule } from './evacuation-details-routing.module';
import { EvacuationDetailsComponent } from './evacuation-details.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EvacuationDetailsComponent],
  imports: [
    CommonModule,
    EvacuationDetailsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class EvacuationDetailsModule {}
