import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileNotesRoutingModule } from './ess-file-notes-routing.module';
import { EssFileNotesComponent } from './ess-file-notes.component';

@NgModule({
  imports: [CommonModule, EssFileNotesRoutingModule, EssFileNotesComponent]
})
export class EssFileNotesModule {}
