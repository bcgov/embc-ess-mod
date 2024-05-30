import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepSupportsRoutingModule } from './step-supports-routing.module';
import { StepSupportsComponent } from './step-supports.component';

@NgModule({
  imports: [CommonModule, StepSupportsRoutingModule, StepSupportsComponent]
})
export class StepSupportsModule {}
