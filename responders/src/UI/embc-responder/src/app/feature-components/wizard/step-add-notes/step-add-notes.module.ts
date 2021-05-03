import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepAddNotesRoutingModule } from './step-add-notes-routing.module';
import { StepAddNotesComponent } from './step-add-notes.component';

@NgModule({
  declarations: [StepAddNotesComponent],
  imports: [CommonModule, StepAddNotesRoutingModule]
})
export class StepAddNotesModule {}
