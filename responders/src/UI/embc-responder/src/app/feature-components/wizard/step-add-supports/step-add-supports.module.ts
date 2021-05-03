import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepAddSupportsRoutingModule } from './step-add-supports-routing.module';
import { StepAddSupportsComponent } from './step-add-supports.component';


@NgModule({
  declarations: [StepAddSupportsComponent],
  imports: [
    CommonModule,
    StepAddSupportsRoutingModule
  ]
})
export class StepAddSupportsModule { }
