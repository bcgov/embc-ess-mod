import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepEssFileRoutingModule } from './step-ess-file-routing.module';
import { StepEssFileComponent } from './step-ess-file.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StepEssFileComponent],
  imports: [
    CommonModule,
    StepEssFileRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class StepEssFileModule {}
