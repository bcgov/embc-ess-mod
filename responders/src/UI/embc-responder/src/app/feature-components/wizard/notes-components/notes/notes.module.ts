import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListNotesComponent } from '../list-notes/list-notes.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NotesComponent, ListNotesComponent],
  imports: [
    CommonModule,
    NotesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class NotesModule {}
