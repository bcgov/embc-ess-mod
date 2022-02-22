import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvacueeSearchRoutingModule } from './evacuee-search-routing.module';
import { EvacueeSearchComponent } from './evacuee-search.component';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify/evacuee-id-verify.component';
import { EvacueeNameSearchComponent } from './evacuee-name-search/evacuee-name-search.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { EvacueeSearchResultsComponent } from './evacuee-search-results/evacuee-search-results.component';
import { EssFilesResultsComponent } from './ess-files-results/ess-files-results.component';
import { ProfileResultsComponent } from './profile-results/profile-results.component';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { DataEntryComponent } from './data-entry/data-entry.component';

@NgModule({
  declarations: [
    EvacueeSearchComponent,
    EvacueeIdVerifyComponent,
    EvacueeNameSearchComponent,
    EvacueeSearchResultsComponent,
    EssFilesResultsComponent,
    ProfileResultsComponent,
    DataEntryComponent
  ],
  imports: [
    CommonModule,
    EvacueeSearchRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    TextMaskModule,
    SharedModule,
    CustomPipeModule
  ],
  exports: [EvacueeIdVerifyComponent, EvacueeNameSearchComponent]
})
export class EvacueeSearchModule {}
