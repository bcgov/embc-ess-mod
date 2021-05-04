import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepCreateProfileRoutingModule } from './step-create-profile-routing.module';
import { StepCreateProfileComponent } from './step-create-profile.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StepCreateProfileComponent],
  imports: [
    CommonModule,
    StepCreateProfileRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class StepCreateProfileModule {}
