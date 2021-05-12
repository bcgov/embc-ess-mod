import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeDetailsRoutingModule } from './evacuee-details-routing.module';
import { EvacueeDetailsComponent } from './evacuee-details.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [EvacueeDetailsComponent],
  imports: [
    CommonModule,
    EvacueeDetailsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    TextMaskModule
  ]
})
export class EvacueeDetailsModule {}
