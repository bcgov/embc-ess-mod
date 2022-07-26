import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvacueeSearchResultsRoutingModule } from './evacuee-search-results-routing.module';
import { EvacueeSearchResultsComponent } from './evacuee-search-results.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileResultsComponent } from '../profile-results/profile-results.component';
import { EssFilesResultsComponent } from '../ess-files-results/ess-files-results.component';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ZeroFileResultComponent } from '../zero-file-result/zero-file-result.component';

@NgModule({
  declarations: [
    EvacueeSearchResultsComponent,
    EssFilesResultsComponent,
    ProfileResultsComponent,
    ZeroFileResultComponent
  ],
  imports: [
    CommonModule,
    EvacueeSearchResultsRoutingModule,
    MaterialModule,
    SharedModule,
    CustomPipeModule,
    ReactiveFormsModule
  ],
  exports: [
    EssFilesResultsComponent,
    ProfileResultsComponent,
    ZeroFileResultComponent
  ]
})
export class EvacueeSearchResultsModule {}
