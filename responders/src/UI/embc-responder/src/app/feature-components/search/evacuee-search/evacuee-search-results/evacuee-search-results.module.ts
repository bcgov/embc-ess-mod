import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeSearchResultsRoutingModule } from './evacuee-search-results-routing.module';
import { EvacueeSearchResultsComponent } from './evacuee-search-results.component';

import { ProfileResultsComponent } from '../profile-results/profile-results.component';
import { EssFilesResultsComponent } from '../ess-files-results/ess-files-results.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ZeroFileResultComponent } from '../zero-file-result/zero-file-result.component';

@NgModule({
  imports: [
    CommonModule,
    EvacueeSearchResultsRoutingModule,
    ReactiveFormsModule,
    EvacueeSearchResultsComponent,
    EssFilesResultsComponent,
    ProfileResultsComponent,
    ZeroFileResultComponent
  ],
  exports: [EssFilesResultsComponent, ProfileResultsComponent, ZeroFileResultComponent]
})
export class EvacueeSearchResultsModule {}
