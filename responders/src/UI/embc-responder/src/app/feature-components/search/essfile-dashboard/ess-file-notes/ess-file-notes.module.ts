import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileNotesRoutingModule } from './ess-file-notes-routing.module';
import { EssFileNotesComponent } from './ess-file-notes.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EssFileNotesComponent],
  imports: [
    CommonModule,
    EssFileNotesRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class EssFileNotesModule {}
