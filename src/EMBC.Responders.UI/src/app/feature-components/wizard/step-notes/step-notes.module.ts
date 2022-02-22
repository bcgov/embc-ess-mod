import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepNotesRoutingModule } from './step-notes-routing.module';
import { StepNotesComponent } from './step-notes.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StepNotesComponent],
  imports: [CommonModule, StepNotesRoutingModule, MaterialModule, SharedModule]
})
export class StepNotesModule {}
