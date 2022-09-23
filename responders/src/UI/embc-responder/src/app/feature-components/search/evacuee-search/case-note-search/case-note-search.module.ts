import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaseNoteSearchRoutingModule } from './case-note-search-routing.module';
import { CaseNoteSearchComponent } from './case-note-search.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CaseNoteSearchComponent],
  imports: [
    CommonModule,
    CaseNoteSearchRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CaseNoteSearchModule {}
