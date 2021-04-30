import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepCreateProfileRoutingModule } from './step-create-profile-routing.module';
import { StepCreateProfileComponent } from './step-create-profile.component';

@NgModule({
  declarations: [StepCreateProfileComponent],
  imports: [CommonModule, StepCreateProfileRoutingModule]
})
export class StepCreateProfileModule {}
