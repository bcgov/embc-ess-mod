import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListNotesComponent } from '../list-notes/list-notes.component';

import { AddNotesComponent } from '../add-notes/add-notes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NotesRoutingModule,
    ReactiveFormsModule,
    NotesComponent,
    ListNotesComponent,
    AddNotesComponent
  ]
})
export class NotesModule {}
