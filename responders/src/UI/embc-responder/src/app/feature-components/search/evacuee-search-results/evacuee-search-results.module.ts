import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvacueeSearchResultsRoutingModule } from './evacuee-search-results-routing.module';
import { EvacueeSearchResultsComponent } from './evacuee-search-results.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileResultsComponent } from './profile-results/profile-results.component';
import { EssFilesResultsComponent } from './ess-files-results/ess-files-results.component';

@NgModule({
  declarations: [
    EvacueeSearchResultsComponent,
    ProfileResultsComponent,
    EssFilesResultsComponent
  ],
  imports: [
    CommonModule,
    EvacueeSearchResultsRoutingModule,
    MaterialModule,
    SharedModule
  ],
  exports: [ProfileResultsComponent, EssFilesResultsComponent]
})
export class EvacueeSearchResultsModule {}
