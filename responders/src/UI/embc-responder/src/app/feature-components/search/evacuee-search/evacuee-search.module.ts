import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvacueeSearchRoutingModule } from './evacuee-search-routing.module';
import { EvacueeSearchComponent } from './evacuee-search.component';

import { ReactiveFormsModule } from '@angular/forms';

import { SearchOptionsComponent } from './search-options/search-options.component';

@NgModule({
  imports: [
    CommonModule,
    EvacueeSearchRoutingModule,
    ReactiveFormsModule,
    EvacueeSearchComponent,
    SearchOptionsComponent
  ]
})
export class EvacueeSearchModule {}
