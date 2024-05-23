import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepNotesRoutingModule } from './step-notes-routing.module';
import { StepNotesComponent } from './step-notes.component';

@NgModule({
  imports: [CommonModule, StepNotesRoutingModule, StepNotesComponent]
})
export class StepNotesModule {}
