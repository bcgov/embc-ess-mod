import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeSearchRoutingModule } from './evacuee-search-routing.module';
import { EvacueeSearchComponent } from './evacuee-search.component';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify/evacuee-id-verify.component';
import { EvacueeNameSearchComponent } from './evacuee-name-search/evacuee-name-search.component';
import { EvacueeSearchResultsComponent } from './evacuee-search-results/evacuee-search-results.component';


@NgModule({
  declarations: [
    EvacueeSearchComponent,
    EvacueeIdVerifyComponent,
    EvacueeNameSearchComponent,
    EvacueeSearchResultsComponent
  ],
  imports: [
    CommonModule,
    EvacueeSearchRoutingModule
  ],
  exports: [
    EvacueeIdVerifyComponent,
    EvacueeNameSearchComponent,
    EvacueeSearchResultsComponent
  ]
})
export class EvacueeSearchModule { }
