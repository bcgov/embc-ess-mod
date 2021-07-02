import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListNotesComponent } from '../list-notes/list-notes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddNotesComponent } from '../add-notes/add-notes.component';

@NgModule({
  declarations: [NotesComponent, ListNotesComponent, AddNotesComponent],
  imports: [
    CommonModule,
    NotesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class NotesModule {}
