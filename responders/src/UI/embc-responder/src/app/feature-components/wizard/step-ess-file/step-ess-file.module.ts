import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepEssFileRoutingModule } from './step-ess-file-routing.module';
import { StepEssFileComponent } from './step-ess-file.component';

@NgModule({
  imports: [CommonModule, StepEssFileRoutingModule, StepEssFileComponent]
})
export class StepEssFileModule {}
