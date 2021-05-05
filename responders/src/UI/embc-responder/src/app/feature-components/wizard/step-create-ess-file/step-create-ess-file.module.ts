import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepCreateEssFileRoutingModule } from './step-create-ess-file-routing.module';
import { StepCreateEssFileComponent } from './step-create-ess-file.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StepCreateEssFileComponent],
  imports: [CommonModule, StepCreateEssFileRoutingModule, MaterialModule, SharedModule]
})
export class StepCreateEssFileModule {}
