import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepNotesRoutingModule } from './step-notes-routing.module';
import { StepNotesComponent } from './step-notes.component';

@NgModule({
  declarations: [StepNotesComponent],
  imports: [CommonModule, StepNotesRoutingModule]
})
export class StepNotesModule {}
