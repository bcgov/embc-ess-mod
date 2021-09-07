import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepSupportsRoutingModule } from './step-supports-routing.module';
import { StepSupportsComponent } from './step-supports.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StepSupportsComponent],
  imports: [CommonModule, StepSupportsRoutingModule, SharedModule]
})
export class StepSupportsModule {}
