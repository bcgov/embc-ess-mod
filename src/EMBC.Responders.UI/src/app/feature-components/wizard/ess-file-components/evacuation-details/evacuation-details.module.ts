import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacuationDetailsRoutingModule } from './evacuation-details-routing.module';
import { EvacuationDetailsComponent } from './evacuation-details.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

@NgModule({
  declarations: [EvacuationDetailsComponent],
  imports: [
    CommonModule,
    CustomPipeModule,
    EvacuationDetailsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class EvacuationDetailsModule {}
