import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeNameSearchRoutingModule } from './evacuee-name-search-routing.module';
import { EvacueeNameSearchComponent } from './evacuee-name-search.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [EvacueeNameSearchComponent],
  imports: [
    CommonModule,
    EvacueeNameSearchRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    TextMaskModule
  ]
})
export class EvacueeNameSearchModule {}
