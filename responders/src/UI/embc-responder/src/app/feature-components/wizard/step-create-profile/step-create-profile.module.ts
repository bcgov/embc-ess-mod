import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepCreateProfileRoutingModule } from './step-create-profile-routing.module';
import { StepCreateProfileComponent } from './step-create-profile.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [StepCreateProfileComponent],
  imports: [CommonModule, StepCreateProfileRoutingModule, MaterialModule]
})
export class StepCreateProfileModule {}
