import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeSearchRoutingModule } from './evacuee-search-routing.module';
import { EvacueeSearchComponent } from './evacuee-search.component';


@NgModule({
  declarations: [EvacueeSearchComponent],
  imports: [
    CommonModule,
    EvacueeSearchRoutingModule
  ]
})
export class EvacueeSearchModule { }
