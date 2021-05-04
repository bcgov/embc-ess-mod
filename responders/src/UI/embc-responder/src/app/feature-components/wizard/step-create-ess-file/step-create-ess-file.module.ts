import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepCreateEssFileRoutingModule } from './step-create-ess-file-routing.module';
import { StepCreateEssFileComponent } from './step-create-ess-file.component';

@NgModule({
  declarations: [StepCreateEssFileComponent],
  imports: [CommonModule, StepCreateEssFileRoutingModule]
})
export class StepCreateEssFileModule {}
