import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaseNoteSearchRoutingModule } from './case-note-search-routing.module';
import { CaseNoteSearchComponent } from './case-note-search.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, CaseNoteSearchRoutingModule, ReactiveFormsModule, CaseNoteSearchComponent]
})
export class CaseNoteSearchModule {}
