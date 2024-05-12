import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileNotesRoutingModule } from './ess-file-notes-routing.module';
import { EssFileNotesComponent } from './ess-file-notes.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, EssFileNotesRoutingModule, MaterialModule, SharedModule, EssFileNotesComponent]
})
export class EssFileNotesModule {}
